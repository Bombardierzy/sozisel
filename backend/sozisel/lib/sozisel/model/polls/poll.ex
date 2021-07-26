defmodule Sozisel.Model.Polls.Poll do
  use Sozisel.Model.Schema

  import Ecto.Changeset

  require Logger

  @validation_prefix "[#{inspect(__MODULE__)}] Validation failed:"

  defmodule PollOption do
    use Sozisel.Model.Schema

    @type t :: %__MODULE__{
            id: String.t(),
            text: String.t()
          }

    @primary_key false
    embedded_schema do
      field :id, :string
      field :text, :string
    end

    def changeset(schema, attrs) do
      schema
      |> cast(attrs, [:id, :text])
      |> validate_required([:id, :text])
    end
  end

  @type t :: %__MODULE__{
          question: String.t(),
          options: [PollOption.t()],
          is_multi_choice: boolean()
        }

  @primary_key false
  embedded_schema do
    field :question, :string
    field :is_multi_choice, :boolean
    embeds_many :options, PollOption, on_replace: :delete
  end

  def changeset(schema, attrs) do
    schema
    |> cast(attrs, [:question, :is_multi_choice])
    |> validate_required([:question, :is_multi_choice])
    |> cast_embed(:options, required: true)
    |> validate_unique_option_ids()
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

  @spec poll_summary(Ecto.UUID.t()) :: map() | nil
  def poll_summary(launched_event_id) do
    alias Sozisel.Repo
    alias Sozisel.Model.Events.Event
    alias Sozisel.Model.LaunchedEvents.LaunchedEvent

    with %LaunchedEvent{} = launched_event <- Repo.get(LaunchedEvent, launched_event_id),
         %LaunchedEvent{
           event: %Event{event_data: %__MODULE__{question: question, options: options}},
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
        total_voters: length(event_results)
      }
    end
  end
end
