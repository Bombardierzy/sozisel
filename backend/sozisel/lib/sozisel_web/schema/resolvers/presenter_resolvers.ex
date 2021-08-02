defmodule SoziselWeb.Schema.Resolvers.PresenterResolvers do
  alias SoziselWeb.Schema.Helpers
  alias SoziselWeb.Schema.Subscriptions.Topics
  alias SoziselWeb.Context
  alias Sozisel.Model.{Sessions, Users.User}
  alias Sessions.Session

  alias Sozisel.Model.{
    Events,
    LaunchedEvents
  }

  alias Events.Event
  alias LaunchedEvents.LaunchedEvent

  def prepare_data_for_participants(
        %Event{} = event,
        %LaunchedEvent{} = launched_event
      ) do
    %{
      id: launched_event.id,
      name: event.name,
      duration_time_sec: event.duration_time_sec,
      event_data: event.event_data
    }
  end

  def send_launched_event(
        _parent,
        %{
          event_id: event_id,
          session_id: session_id
        } = attrs,
        ctx
      ) do
    %User{id: presenter_id} = Context.current_user!(ctx)

    with %Session{user_id: ^presenter_id} = session <- Sessions.get_session(session_id),
         %Event{} = event <- Events.get_event(event_id),
         {:ok, launched_event} <- LaunchedEvents.create_launched_event(session, event) do
      participant_event = prepare_data_for_participants(event, launched_event)

      publish_event(attrs, participant_event)

      {:ok, launched_event}
    else
      {:error, %Ecto.Changeset{} = changeset} ->
        changeset
        |> Ecto.Changeset.traverse_errors(&elem(&1, 0))
        |> Map.values()
        |> List.flatten()
        |> Enum.join(",")
        |> then(&{:error, &1})

      _ ->
        {:error, "unauthorized"}
    end
  end

  def publish_event(%{broadcast: true} = attrs, participant_event) do
    Helpers.subscription_publish(
      :event_launched,
      Topics.session_all_participants(attrs.session_id),
      participant_event
    )
  end

  def publish_event(%{broadcast: false} = attrs, participant_event) do
    attrs.target_participants
    |> Enum.map(fn participant_id ->
      Helpers.subscription_publish(
        :event_launched,
        Topics.session_participant(attrs.session_id, participant_id),
        participant_event
      )
    end)
  end
end
