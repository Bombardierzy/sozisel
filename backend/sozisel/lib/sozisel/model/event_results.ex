defmodule Sozisel.Model.EventResults do
  import Ecto.Query, warn: false

  alias Sozisel.Repo

  alias Sozisel.Model.{EventResults, LaunchedEvents, Events}
  alias EventResults.EventResult
  alias LaunchedEvents.LaunchedEvent
  alias Events.Event

  require Logger

  def list_event_results do
    Repo.all(EventResult)
  end

  def get_event_result!(id), do: Repo.get!(EventResult, id)

  def create_event_result(%{launched_event_id: launched_event_id} = attrs) do
    with %LaunchedEvent{event_id: event_id} <- Repo.get(LaunchedEvent, launched_event_id),
         %Event{event_data: %event_data_module{} = event_data} <- Repo.get(Event, event_id),
         :ok <- event_data_module.validate_result(event_data, attrs) do
      %EventResult{}
      |> EventResult.create_changeset(attrs)
      |> Repo.insert()
    else
      {:error, :unmatched_event_result} = error ->
        error

      nil ->
        {:error, :launched_event_not_found}
    end
  end

  def create_event_result(_attrs) do
    raise RuntimeError, "invalid attributes, expected at least 'launched_event_id'"
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

  def get_all_event_results(%LaunchedEvent{} = launched_event) do
    launched_event
    |> Repo.preload(:event_results)
    |> then(& &1.event_results)
    |> Repo.preload(:participant)
  end
end
