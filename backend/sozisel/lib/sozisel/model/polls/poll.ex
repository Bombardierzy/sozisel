defmodule Sozisel.Model.Polls.Poll do
  use Sozisel.Model.Schema
  import Ecto.Changeset

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
          options: [PollOption.t()]
        }

  @primary_key false
  embedded_schema do
    field :question, :string
    embeds_many :options, PollOption, on_replace: :delete
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

      summaries =
        event_results
        |> Enum.group_by(& &1.result_data.option_id)
        |> Enum.map(fn {key, values} ->
          %{
            id: key,
            text: mapped_options[key].text,
            votes: length(values)
          }
        end)

      %{id: launched_event_id, question: question, option_summaries: summaries}
    end
  end

  def changeset(schema, attrs) do
    schema
    |> cast(attrs, [:question])
    |> validate_required([:question])
    |> cast_embed(:options, required: true)
    |> validate_unique_option_ids()
  end

  @spec validate_result(t(), map) :: :ok | {:error, :unmatched_event_result}
  def validate_result(%__MODULE__{options: options}, %{result_data: %{option_id: option_id}}) do
    if Enum.any?(options, &(&1.id == option_id)) do
      :ok
    else
      {:error, :unmatched_event_result}
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
end
