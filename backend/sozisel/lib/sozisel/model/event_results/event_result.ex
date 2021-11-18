defmodule Sozisel.Model.EventResults.EventResult do
  use Sozisel.Model.Schema
  import Ecto.Changeset
  import PolymorphicEmbed, only: [cast_polymorphic_embed: 3]

  alias Sozisel.Model.Quizzes.QuizResult
  alias Sozisel.Model.Polls.PollResult
  alias Sozisel.Model.Whiteboards.WhiteboardResult
  # EVAL alias Sozisel.Model.<%= @module %>s.<%= @module %>Result
  alias Sozisel.Model.Participants.Participant
  alias Sozisel.Model.LaunchedEvents.LaunchedEvent

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          participant_id: Ecto.UUID.t(),
          participant: Participant.t() | Ecto.Association.NotLoaded.t(),
          launched_event_id: Ecto.UUID.t(),
          launched_event: LaunchedEvent.t() | Ecto.Association.NotLoaded.t(),
          result_data: PolymorphicEmbed.t(),
          inserted_at: DateTime.t(),
          updated_at: DateTime.t()
        }

  schema "event_results" do
    field :result_data, PolymorphicEmbed,
      types: [
        quiz_result: [module: QuizResult, identify_by_fields: [:participant_answers]],
        poll_result: [module: PollResult, identify_by_fields: [:option_ids]],
        whiteboard_result: [
          module: WhiteboardResult,
          identify_by_fields: [:path, :text, :used_time]
        ] #COMMA
        #TODO: implement me!
        # EVAL <%= @event_name %>_result: [module: <%= @module %>Result, identify_by_fields: []] #COMMA
      ],
      on_type_not_found: :raise,
      on_replace: :update

    belongs_to :participant, Participant
    belongs_to :launched_event, LaunchedEvent

    timestamps()
  end

  def create_changeset(event_result, attrs) do
    event_result
    |> cast(attrs, [:participant_id, :launched_event_id])
    |> cast_polymorphic_embed(:result_data, required: true)
    |> validate_required([:participant_id, :launched_event_id, :result_data])
    |> foreign_key_constraint(:participant_id)
    |> foreign_key_constraint(:launched_event_id)
  end

  def update_changeset(event_result, attrs) do
    event_result
    |> cast(attrs, [])
    |> cast_polymorphic_embed(:result_data, required: true)
    |> validate_required([:result_data])
  end
end
