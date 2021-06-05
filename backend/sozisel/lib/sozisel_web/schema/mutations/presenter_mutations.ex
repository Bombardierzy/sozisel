defmodule SoziselWeb.Schema.Mutations.PresenterMutations do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.Resolvers.PresenterResolvers
  alias SoziselWeb.Schema.{Middleware}

  object :presenter_mutations do
    field :send_launched_event_to_participants, :launched_event do
      arg :event_id, non_null(:id)
      arg :session_id, non_null(:id)
      arg :broadcast, non_null(:boolean)
      arg :target_participants, strong_list_of(:id)

      middleware Middleware.Authorization
      resolve &PresenterResolvers.send_launched_event_to_participants/3
    end
  end
end
