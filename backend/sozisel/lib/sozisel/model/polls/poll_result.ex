defmodule Sozisel.Model.Polls.PollResult do
  use Sozisel.Model.Schema

  import Ecto.Changeset

  @type t :: %__MODULE__{
          poll_option_id: Ecto.UUID.t()
        }

  @primary_key false

  @primary_key false
  embedded_schema do
    field :poll_option_id, :id
  end

  def changeset(quiz_result, attrs) do
    quiz_result
    |> cast(attrs, [:poll_option_id])
  end
end
