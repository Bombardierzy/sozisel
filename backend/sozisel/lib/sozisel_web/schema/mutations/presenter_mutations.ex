defmodule SoziselWeb.Schema.Mutations.PresenterMutations do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.Resolvers.PresenterResolvers
  alias SoziselWeb.Schema.{Middleware}

  object :presenter_mutations do
    field :send_event_to_all, :launched_event do
      arg :event_id, non_null(:id)
      arg :session_id, non_null(:id)

      middleware Middleware.Authorization
      resolve &PresenterResolvers.send_event_to_all/3
    end

    field :send_event_to_listed_participants, :launched_event do
      arg :event_id, non_null(:id)
      arg :session_id, non_null(:id)
      arg :participant_ids, strong_list_of(:id)

      middleware Middleware.Authorization
      resolve &PresenterResolvers.send_event_to_listed_participants/3
    end
  end
end
