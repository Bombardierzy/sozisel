defmodule Sozisel.Model.EventResults.EventResult do
  use Sozisel.Model.Schema
  import Ecto.Changeset
  import PolymorphicEmbed, only: [cast_polymorphic_embed: 3]

  alias Sozisel.Model.Quizzes.QuizResult
  alias Sozisel.Model.Participants.Participant

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          participant_token: String.t(),
          result_data: PolymorphicEmbed.t(),
          inserted_at: DateTime.t(),
          updated_at: DateTime.t()
        }

  schema "event_results" do

    field :result_data, PolymorphicEmbed,
      types: [
        quiz_result: [module: QuizResult, identify_by_fields: [:participant_answers]]
      ],
      on_type_not_found: :raise,
      on_replace: :update

    belongs_to :participant_token, Participant, foreign_key: :token_id

    timestamps()
  end

  def create_changeset(event_result, attrs) do
    event_result
    |> cast(attrs, [:participant_token])
    |> cast_polymorphic_embed(:result_data, required: true)
    |> validate_required([:participant_token, :result_data])
    |> foreign_key_constraint(:participant_token)
  end

  def update_changeset(event_result, attrs) do
    event_result
    |> cast_polymorphic_embed(:result_data, required: true)
    |> validate_required([:result_data])
  end
end
