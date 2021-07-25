defmodule Sozisel.Model.Polls.PollResult do
  use Sozisel.Model.Schema

  import Ecto.Changeset

  @type t :: %__MODULE__{
          option_id: String.t()
        }

  @primary_key false
  embedded_schema do
    field :option_id, :string
  end

  @spec changeset(t(), map) :: Ecto.Changeset.t()
  def changeset(quiz_result, attrs) do
    quiz_result
    |> cast(attrs, [:option_id])
  end
end
