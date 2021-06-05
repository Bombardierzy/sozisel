defmodule Sozisel.Model.Events do
  @moduledoc """
  The Events context.
  """

  import Ecto.Query, warn: false
  alias Sozisel.Repo

  alias Sozisel.Model.{Events.Event, Utils, Quizzes.Quiz}

  def list_events do
    Repo.all(Event)
  end

  def list_template_events(session_template_id) do
    from(e in Event, where: e.session_template_id == ^session_template_id)
    |> Repo.all()
  end

  def get_event!(id), do: Repo.get!(Event, id)

  def get_event(id) do
    Repo.get(Event, id)
  end

  def create_event(attrs \\ %{}) do
    %Event{}
    |> Event.create_changeset(attrs)
    |> Repo.insert()
  end

  def update_event(%Event{} = event, attrs) do
    event
    |> Event.update_changeset(attrs)
    |> Repo.update()
  end

  def delete_event(%Event{} = event) do
    Repo.delete(event)
  end

  def clone_event(%Event{} = event, session_template_id) do
    event
    |> Utils.from_deep_struct()
    |> Map.merge(%{id: nil, session_template_id: session_template_id})
    |> create_event()
  end

  def change_event(%Event{} = event, attrs \\ %{}) do
    Event.create_changeset(event, attrs)
  end

  def marshal_participant_event_data(%{__struct__: Quiz} = event_data) do
    quiz_questions_data =
      event_data.quiz_questions
      |> Enum.map(&Map.take(&1, [:question_id, :question, :answer]))

    event_data
    |> Map.take([:duration_time_sec, :tracking_mode])
    |> Map.put(:quiz_questions, quiz_questions_data)
  end

  def marshal_participant_event_data(other), do: other
end
