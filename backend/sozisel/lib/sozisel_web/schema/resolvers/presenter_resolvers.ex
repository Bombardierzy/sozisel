defmodule SoziselWeb.Schema.Resolvers.PresenterResolvers do
  alias SoziselWeb.Schema.Helpers
  alias SoziselWeb.Schema.Subscriptions.Topics

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
    event_data = event.event_data

    participant_event_data = Events.marshal_participant_event_data(event_data)

    %{
      id: launched_event.id,
      name: event.name,
      event_data: participant_event_data
    }
  end

  def send_launched_event(
        _parent,
        %{
          event_id: event_id,
          session_id: session_id
        } = attrs,
        _ctx
      ) do
    with %Event{} = event <- Events.get_event(event_id) do
      {:ok, launched_event} =
        LaunchedEvents.create_launched_event(%{
          event_id: event_id,
          session_id: session_id
        })

      participant_event = prepare_data_for_participants(event, launched_event)

      publish_event(attrs, participant_event)

      {:ok, launched_event}
    else
      _ -> {:error, "unauthorized"}
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
