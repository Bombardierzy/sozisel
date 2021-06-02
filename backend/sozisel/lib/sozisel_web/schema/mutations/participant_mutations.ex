defmodule SoziselWeb.Schema.Mutations.ParticipantMutations do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.Resolvers.ParticipantResolvers
  alias SoziselWeb.Schema.{Middleware}

  object :participant_mutations do
    field :join_session, :join_session_result do
      arg :input, non_null(:join_session_input)

      resolve &ParticipantResolvers.join_session/3
    end

    field :finish_quiz, :event_result do
      arg :input, non_null(:quiz_result_input)
      arg :token, non_null(:string)

      middleware Middleware.Participant

      resolve &ParticipantResolvers.finish_quiz/3
    end
  end
end
