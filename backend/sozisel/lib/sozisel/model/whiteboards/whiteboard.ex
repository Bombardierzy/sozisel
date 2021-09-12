defmodule Sozisel.Model.Whiteboards.Whiteboard do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  require Logger

  @validation_prefix "[#{inspect(__MODULE__)}] Validation failed:"

  @type t :: %__MODULE__{
          task: String.t()
        }

  @primary_key false

  embedded_schema do
    field :task, :string
  end

  def changeset(whiteboard, attrs) do
    whiteboard
    |> cast(attrs, [:task])
    |> validate_required([:task])
  end

  @spec validate_result(t(), map) :: :ok | {:error, :unmatched_event_result}
  def validate_result(%__MODULE__{}, %{
        result_data: %{used_time: used_time}
      }) do
    if used_time < 0.0 do
      Logger.error("#{@validation_prefix} used time must be positive but is #{used_time}")

      {:error, :unmatched_event_result}
    else
      :ok
    end
  end

  def validate_result(_whiteboard, _whiteboard_result) do
    {:error, :unmatched_event_result}
  end
end
