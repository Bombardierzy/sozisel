defmodule SoziselWeb.Schema do
  use Absinthe.Schema

  # Types
  import_types Absinthe.Type.Custom
  import_types(SoziselWeb.Schema.Types.HelloTypes)
  import_types(SoziselWeb.Schema.Types.UserTypes)
  import_types(SoziselWeb.Schema.Types.SessionTemplateTypes)
  import_types(SoziselWeb.Schema.Types.EventTypes)

  # Queries
  import_types(SoziselWeb.Schema.Queries.HelloQueries)
  import_types(SoziselWeb.Schema.Queries.UserQueries)
  import_types(SoziselWeb.Schema.Queries.SessionTemplateQueries)

  # Mutations
  import_types(SoziselWeb.Schema.Mutations.HelloMutations)
  import_types(SoziselWeb.Schema.Mutations.UserMutations)
  import_types(SoziselWeb.Schema.Mutations.SessionTemplateMutations)
  import_types(SoziselWeb.Schema.Mutations.EventMutations)

  # Subscriptionis
  import_types(SoziselWeb.Schema.Subscriptions.HelloSubscriptions)

  query do
    import_fields(:hello_queries)
    import_fields(:user_queries)
    import_fields(:session_template_queries)
  end

  mutation do
    import_fields(:hello_mutations)
    import_fields(:user_mutations)
    import_fields(:session_template_mutations)
    import_fields(:event_mutations)
  end

  subscription do
    import_fields(:hello_subscriptions)
  end

  def middleware(middleware, _field, _config) do
    middleware ++ [Crudry.Middlewares.TranslateErrors]
  end

  def plugins do
    [Absinthe.Middleware.Dataloader | Absinthe.Plugin.defaults()]
  end
end
