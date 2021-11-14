
defmodule Sozisel.Model.<%= @module %>s.<%= @module %> do
  use Sozisel.Model.Schema

  import Ecto.Changeset

  # This module should be responsible for defining all necessary
  # event fields and rules for its validation.

  # TODO: implement me!
  @type t :: %__MODULE__{}

  # TODO: implement me!
  @primary_key false
  embedded_schema do
  end

  # TODO: implement me!
  def changeset(schema, attrs) do
    schema
    |> cast(attrs, [])
  end

  # TODO: implement me!
  # This function is responsible for validating if given event's result is valid
  # given the event itself. Go see already existing events for hints how to implement
  # this function.
  @spec validate_result(t(), map) :: :ok | {:error, :unmatched_event_result}
  def validate_result(%__MODULE__{}, %{result_data: %{}}) do
    :ok
  end

  def validate_result(_event, _event_result) do
    {:error, :unmatched_event_result}
  end
end
