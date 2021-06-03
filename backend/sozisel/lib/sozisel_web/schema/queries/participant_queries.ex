defmodule SoziselWeb.Schema.Queries.ParticipantQueries do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.Middleware

  object :participant_queries do
    # This is a sample query demonstrating usage of Participant middleware
    field :my_participation, :participant do
      arg :token, non_null(:string)

      middleware(Middleware.Participant)

      resolve fn _parent, _args, %{context: %{participant: participant, session: _}} ->
        {:ok, participant}
      end
    end
  end
end
