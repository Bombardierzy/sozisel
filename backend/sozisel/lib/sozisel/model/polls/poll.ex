defmodule Sozisel.Model.Polls.Poll do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  defmodule PollOption do
    use Sozisel.Model.Schema

    @type t :: %__MODULE__{
            option_id: String.t(),
            text: String.t()
          }

    @primary_key false
    embedded_schema do
      field :option_id, :string
      field :text, :string
    end

    def changeset(schema, attrs) do
      schema
      |> cast(attrs, [:option_id, :text])
      |> validate_required([:option_id, :text])
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

  def changeset(schema, attrs) do
    schema
    |> cast(attrs, [:question])
    |> validate_required([:question])
    |> cast_embed(:options)
  end

  @spec validate_result(t(), map) :: :ok | {:error, :unmatched_event_result}
  def validate_result(%__MODULE__{options: options}, %{result_data: %{option_id: option_id}}) do
    if Enum.any?(options, &(&1.option_id == option_id)) do
      :ok
    else
      {:error, :unmatched_event_result}
    end
  end
end
