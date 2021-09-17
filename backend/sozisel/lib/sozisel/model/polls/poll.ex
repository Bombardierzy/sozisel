defmodule Sozisel.Model.Polls.Poll do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Polls.PollOption

  require Logger

  @validation_prefix "[#{inspect(__MODULE__)}] Validation failed:"

  @type t :: %__MODULE__{
          question: String.t(),
          options: [PollOption.t()],
          is_multi_choice: boolean()
        }

  @primary_key false
  embedded_schema do
    field :question, :string
    field :is_multi_choice, :boolean, default: false
    embeds_many :options, PollOption, on_replace: :delete
  end

  def changeset(schema, attrs) do
    schema
    |> cast(attrs, [:question, :is_multi_choice])
    |> validate_required([:question])
    |> cast_embed(:options, required: true)
    |> validate_unique_option_ids()
  end

  defp validate_unique_option_ids(changeset) do
    options =
      (get_change(changeset, :options) || get_field(changeset, :options))
      |> Enum.reject(&(&1.action == :replace))

    ids = Enum.map(options, &(get_change(&1, :id) || get_field(&1, :id)))

    if MapSet.new(ids) |> MapSet.size() == length(ids) do
      changeset
    else
      add_error(changeset, :options, "options ids must be unique")
    end
  end

  @spec validate_result(t(), map) :: :ok | {:error, :unmatched_event_result}
  def validate_result(%__MODULE__{options: options, is_multi_choice: is_multi_choice}, %{
        result_data: %{option_ids: option_ids}
      }) do
    cond do
      option_ids == [] ->
        Logger.error("#{@validation_prefix} option_ids array cannot be empty")

        {:error, :unmatched_event_result}

      not is_multi_choice and length(option_ids) != 1 ->
        Logger.error(
          "#{@validation_prefix} multi choice is disabled but provided #{length(option_ids)} options"
        )

        {:error, :unmatched_event_result}

      not is_multi_choice and not Enum.any?(options, &(&1.id == List.first(option_ids))) ->
        Logger.error("#{@validation_prefix} given option is not valid")
        {:error, :unmatched_event_result}

      is_multi_choice and MapSet.new(option_ids) |> MapSet.size() != length(option_ids) ->
        Logger.error("#{@validation_prefix} provided result options are not unique")
        {:error, :unmatched_event_result}

      is_multi_choice and
          MapSet.difference(MapSet.new(option_ids), MapSet.new(options, & &1.id)) != MapSet.new() ->
        Logger.error("#{@validation_prefix} provided options ids do not cover poll's options")
        {:error, :unmatched_event_result}

      true ->
        :ok
    end
  end

  def validate_result(_poll, _poll_result) do
    {:error, :unmatched_event_result}
  end
end
