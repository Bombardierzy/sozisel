defmodule Sozisel.Model.EventResults do
  import Ecto.Query, warn: false
  alias Sozisel.Repo

  alias Sozisel.Model.EventResults.EventResult

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
end
