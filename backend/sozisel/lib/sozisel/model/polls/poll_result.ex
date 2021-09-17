defmodule Sozisel.Model.Polls.PollResult do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Repo
  alias Sozisel.Model.Events.Event
  alias Sozisel.Model.Polls.Poll
  alias Sozisel.Model.LaunchedEvents.LaunchedEvent

  @type t :: %__MODULE__{
          option_ids: [String.t()]
        }

  @primary_key false
  embedded_schema do
    field :option_ids, {:array, :string}
  end

  @spec changeset(t(), map) :: Ecto.Changeset.t()
  def changeset(quiz_result, attrs) do
    quiz_result
    |> cast(attrs, [:option_ids])
    |> validate_required([:option_ids])
  end

  @spec poll_summary(Ecto.UUID.t()) :: map() | nil
  def poll_summary(launched_event_id) do
    with %LaunchedEvent{} = launched_event <- Repo.get(LaunchedEvent, launched_event_id),
         %LaunchedEvent{
           event: %Event{
             event_data: %Poll{
               is_multi_choice: is_multi_choice,
               question: question,
               options: options
             }
           },
           event_results: event_results
         } <- Repo.preload(launched_event, [:event, :event_results]) do
      mapped_options =
        options
        |> Enum.map(&{&1.id, &1})
        |> Enum.into(%{})

      options_acc =
        options
        |> Enum.map(&{&1.id, 0})
        |> Enum.into(%{})

      counted_options =
        event_results
        |> Enum.map(& &1.result_data.option_ids)
        |> List.flatten()
        |> Enum.frequencies()

      summaries =
        options_acc
        |> Map.merge(counted_options)
        |> Enum.map(fn {option_id, votes} ->
          %{
            id: option_id,
            text: mapped_options[option_id].text,
            votes: votes
          }
        end)

      %{
        id: launched_event_id,
        question: question,
        option_summaries: summaries,
        total_voters: length(event_results),
        is_multi_choice: is_multi_choice
      }
    end
  end
end
