defmodule Sozisel.Model.EventResults do
  import Ecto.Query, warn: false
  alias Sozisel.Repo

  alias Sozisel.Model.{EventResults, LaunchedEvents.LaunchedEvent, Utils}
  alias EventResults.EventResult

  def list_event_results do
    Repo.all(EventResult)
  end

  def get_event_result!(id), do: Repo.get!(EventResult, id)

  def create_event_result(attrs \\ %{}) do
    %EventResult{}
    |> EventResult.create_changeset(attrs)
    |> Repo.insert()
  end

  def update_event_result(%EventResult{} = event_result, attrs) do
    event_result
    |> EventResult.update_changeset(attrs)
    |> Repo.update()
  end

  def delete_event_result(%EventResult{} = event_result) do
    Repo.delete(event_result)
  end

  def change_event_result(%EventResult{} = event_result, attrs \\ %{}) do
    EventResult.create_changeset(event_result, attrs)
  end

  def get_all_event_results(%LaunchedEvent{id: launched_event_id}) do
    from(res in EventResult, where: res.launched_event_id == ^launched_event_id)
    |> Repo.all()
  end

  def quiz_result_summary(%LaunchedEvent{} = event_launched) do
    quiz_results = get_all_event_results(event_launched)
    # IO.inspect(quiz_results)

    Enum.each(quiz_results, fn event_data -> 
      %{result_data: result_data} = Utils.from_deep_struct(event_data) 
      |> Map.take([:result_data])

      %{quiz_time: quiz_time} = 
      result_data
      |> Map.take([:quiz_time])
      quiz_time
     end)
     
    %{
        number_of_participants: length(quiz_results),
        average_points: 32.12,
        average_answer_time: 434.321
    }

  end
end
