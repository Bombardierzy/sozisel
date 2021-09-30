defmodule Sozisel.Model.Whiteboards.WhiteboardResult do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Repo
  alias Sozisel.Model.Events.Event
  alias Sozisel.Model.Whiteboards.Whiteboard
  alias Sozisel.Model.LaunchedEvents.LaunchedEvent

  @type t :: %__MODULE__{
          path: String.t(),
          text: String.t(),
          used_time: Float.t()
        }

  @primary_key false

  embedded_schema do
    field :path, :string
    field :text, :string
    field :used_time, :float
  end

  @spec changeset(t(), map) :: Ecto.Changeset.t()
  def changeset(whiteboard_result, attrs) do
    whiteboard_result
    |> cast(attrs, [:path, :used_time, :text])
    |> validate_required([:path, :used_time])
  end

  @spec generate_filename(Ecto.UUID.t(), Ecto.UUID.t(), String.t()) :: String.t()
  def generate_filename(launched_event_id, participant_id, extension) do
    "whiteboard_#{launched_event_id}_#{participant_id}#{extension}" |> String.replace(" ", "_")
  end

  @spec whiteboard_summary(Ecto.UUID.t()) :: map() | nil
  def whiteboard_summary(launched_event_id) do
    with %LaunchedEvent{} = launched_event <- Repo.get(LaunchedEvent, launched_event_id),
         %LaunchedEvent{
           event: %Event{
             event_data: %Whiteboard{
               task: task
             }
           },
           event_results: event_results
         } <- Repo.preload(launched_event, [:event, :event_results, event_results: :participant]) do
      answers =
        event_results
        |> Enum.map(fn participant_result ->
          %{
            full_name: participant_result.participant.full_name,
            email: participant_result.participant.email,
            image_path: participant_result.result_data.path,
            used_time: participant_result.result_data.used_time,
            additional_text: participant_result.result_data.text
          }
        end)

      total_used_time =
        event_results
        |> Enum.map(& &1.result_data.used_time)
        |> Enum.sum()

      %{
        id: launched_event_id,
        task: task,
        average_used_time: (total_used_time / length(event_results)) |> Float.round(2),
        participants_whiteboard_tasks: answers
      }
    end
  end
end
