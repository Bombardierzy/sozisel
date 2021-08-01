defmodule Sozisel.Model.Polls.PollResult do
  use Sozisel.Model.Schema

  import Ecto.Changeset

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
end
