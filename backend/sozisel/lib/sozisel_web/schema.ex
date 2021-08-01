defmodule SoziselWeb.Schema do
  use Absinthe.Schema

  # Types

  import_types Absinthe.Plug.Types

  import_types Absinthe.Type.Custom
  import_types(SoziselWeb.Schema.Types.UserTypes)
  import_types(SoziselWeb.Schema.Types.SessionTemplateTypes)
  import_types(SoziselWeb.Schema.Types.EventTypes)
  import_types(SoziselWeb.Schema.Types.QuizTypes)
  import_types(SoziselWeb.Schema.Types.SessionTypes)
  import_types(SoziselWeb.Schema.Types.ParticipantTypes)
  import_types(SoziselWeb.Schema.Types.EventResultTypes)
  import_types(SoziselWeb.Schema.Types.ParticipantTypes)

  # Queries
  import_types(SoziselWeb.Schema.Queries.UserQueries)
  import_types(SoziselWeb.Schema.Queries.SessionTemplateQueries)
  import_types(SoziselWeb.Schema.Queries.EventQueries)
  import_types(SoziselWeb.Schema.Queries.SessionQueries)
  import_types(SoziselWeb.Schema.Queries.ParticipantQueries)
  import_types(SoziselWeb.Schema.Queries.QuizQueries)

  # Mutations
  import_types(SoziselWeb.Schema.Mutations.UserMutations)
  import_types(SoziselWeb.Schema.Mutations.SessionTemplateMutations)
  import_types(SoziselWeb.Schema.Mutations.QuizMutations)
  import_types(SoziselWeb.Schema.Mutations.SessionMutations)
  import_types(SoziselWeb.Schema.Mutations.ParticipantMutations)
  import_types(SoziselWeb.Schema.Mutations.PresenterMutations)

  # Subscriptions
  import_types(SoziselWeb.Schema.Subscriptions.EventSubscriptions)
  import_types(SoziselWeb.Schema.Subscriptions.SessionSubscriptions)

  query do
    import_fields(:user_queries)
    import_fields(:session_template_queries)
    import_fields(:event_queries)
    import_fields(:session_queries)
    import_fields(:participant_queries)
    import_fields(:quiz_queries)
  end

  mutation do
    import_fields(:user_mutations)
    import_fields(:session_template_mutations)
    import_fields(:quiz_mutations)
    import_fields(:session_mutations)
    import_fields(:participant_mutations)
    import_fields(:presenter_mutations)
  end

  subscription do
    import_fields(:participant_event_subscriptions)
    import_fields(:presenter_event_subscriptions)
    import_fields(:session_subscriptions)
  end

  def middleware(middleware, _field, _config) do
    middleware ++ [SoziselWeb.Schema.Middleware.ChangesetErrorTranslator]
  end

  def plugins do
    [Absinthe.Middleware.Dataloader | Absinthe.Plugin.defaults()]
  end
end
