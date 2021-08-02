defmodule Sozisel.Model.Quizzes.Answer do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  @type t :: %__MODULE__{
          text: String.t(),
          id: String.t()
        }

  @primary_key false
  embedded_schema do
    field :text, :string
    field :id, :string
  end

  def changeset(answer, attrs) do
    answer
    |> cast(attrs, [:text, :id])
    |> validate_required([:text, :id])
  end
end
