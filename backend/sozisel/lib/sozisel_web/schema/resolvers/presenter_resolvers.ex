defmodule SoziselWeb.Schema.Resolvers.PresenterResolvers do
  alias SoziselWeb.Schema.Helpers
  alias SoziselWeb.Schema.Subscriptions.Topics

  alias Sozisel.Model.{
    Sessions,
    Events,
    LaunchedEvents
  }

  alias Events.Event
  alias LaunchedEvents.LaunchedEvent
  alias Sessions.Session

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

  def send_event_to_participants(
        _parent,
        %{event_id: event_id, session_id: session_id, broadcast: true},
        _ctx
      ) do
    with %Event{} = event <- Events.get_event(event_id),
         %Session{} = session <- Sessions.get_session(session_id) do
      {:ok, launched_event} =
        LaunchedEvents.create_launched_event(%{
          event_id: event_id,
          session_id: session_id
        })

      participant_event = prepare_data_for_participants(event, launched_event)

      Helpers.subscription_publish(
        :event_launched,
        Topics.session_all_participants(session.id),
        participant_event
      )

      {:ok, launched_event}
    else
      _ -> {:error, "unauthorized"}
    end
  end

  def send_event_to_participants(
        _parent,
        %{
          event_id: event_id,
          session_id: session_id,
          broadcast: false,
          target_participants: target_participants
        },
        _ctx
      ) do
    with %Event{} = event <- Events.get_event(event_id),
         %Session{} = session <- Sessions.get_session(session_id) do
      {:ok, launched_event} =
        LaunchedEvents.create_launched_event(%{
          event_id: event_id,
          session_id: session_id
        })

      participant_event = prepare_data_for_participants(event, launched_event)

      target_participants
      |> Enum.map(fn participant_id ->
        Helpers.subscription_publish(
          :event_launched,
          Topics.session_participant(session.id, participant_id),
          participant_event
        )
      end)

      {:ok, launched_event}
    else
      _ -> {:error, "unauthorized"}
    end
  end
end
