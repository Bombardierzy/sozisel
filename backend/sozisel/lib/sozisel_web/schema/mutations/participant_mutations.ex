defmodule SoziselWeb.Schema.Mutations.ParticipantMutations do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.Resolvers.ParticipantResolvers
  alias SoziselWeb.Schema.{Middleware}

  object :participant_mutations do
    field :join_session, :join_session_result do
      arg :input, non_null(:join_session_input)

      resolve &ParticipantResolvers.join_session/3
    end

    field :submit_quiz_results, :event_result do
      arg :input, non_null(:quiz_result_input)
      arg :token, non_null(:string)

      middleware Middleware.Participant

      resolve &ParticipantResolvers.submit_quiz_results/3
    end

    field :submit_poll_result, :event_result do
      arg :input, non_null(:poll_result_input)
      arg :token, non_null(:string)

      middleware Middleware.Participant
      resolve &ParticipantResolvers.submit_poll_result/3
    end

    field :submit_whiteboard_result, :event_result do
      arg :input, non_null(:whiteboard_result_input)
      arg :token, non_null(:string)

      middleware Middleware.Participant
      resolve &ParticipantResolvers.submit_whiteboard_result/3
    end
  end
end
