defmodule SoziselWeb.Schema do
  use Absinthe.Schema

  # Types
  import_types Absinthe.Type.Custom
  import_types(SoziselWeb.Schema.Types.UserTypes)
  import_types(SoziselWeb.Schema.Types.SessionTemplateTypes)
  import_types(SoziselWeb.Schema.Types.EventTypes)
  import_types(SoziselWeb.Schema.Types.QuizTypes)
  import_types(SoziselWeb.Schema.Types.SessionTypes)

  # Queries
  import_types(SoziselWeb.Schema.Queries.UserQueries)
  import_types(SoziselWeb.Schema.Queries.SessionTemplateQueries)
  import_types(SoziselWeb.Schema.Queries.SessionQueries)

  # Mutations
  import_types(SoziselWeb.Schema.Mutations.UserMutations)
  import_types(SoziselWeb.Schema.Mutations.SessionTemplateMutations)
  import_types(SoziselWeb.Schema.Mutations.QuizMutations)
  import_types(SoziselWeb.Schema.Mutations.SessionMutations)

  query do
    import_fields(:user_queries)
    import_fields(:session_template_queries)
    import_fields(:session_queries)
  end

  mutation do
    import_fields(:user_mutations)
    import_fields(:session_template_mutations)
    import_fields(:quiz_mutations)
    import_fields(:session_mutations)
  end

  def middleware(middleware, _field, _config) do
    middleware ++ [Crudry.Middlewares.TranslateErrors]
  end

  def plugins do
    [Absinthe.Middleware.Dataloader | Absinthe.Plugin.defaults()]
  end
end
