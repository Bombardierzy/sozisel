defmodule SoziselWeb.Schema.Mutations.ParticipantMutations do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.Resolvers.ParticipantResolvers

  object :participant_mutations do
    field :join_session, :join_session_result do
      arg :input, non_null(:join_session_input)

      resolve &ParticipantResolvers.create/3
    end

    field :finish_quiz, :event_result do
      arg :input, non_null(:quiz_result_input)

      resolve &ParticipantResolvers.check_quiz/3
    end
  end
end
