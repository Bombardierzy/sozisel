defmodule SoziselWeb.Schema.Subscriptions.Topics do
  def session_events(session_id) do
    "session:events:#{session_id}"
  end

  def session_participant_events(session_id, participant_id) do
    "session:events:#{session_id}:#{participant_id}"
  end

  def session_presenter(session_id, presenter_id) do
    "session:presenter:#{session_id}:#{presenter_id}"
  end
end
