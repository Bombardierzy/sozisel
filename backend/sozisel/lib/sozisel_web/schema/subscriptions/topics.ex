defmodule SoziselWeb.Schema.Subscriptions.Topics do
  def session_participant(session_id, participant_id) do
    "session:#{session_id}:participant:#{participant_id}"
  end

  def session_presenter(session_id, presenter_id) do
    "session:#{session_id}:presenter:#{presenter_id}"
  end

  def session_all_participants(session_id) do
    "session:#{session_id}:participants"
  end

  def poll(launched_event_id) do
    "poll:#{launched_event_id}"
  end
end
