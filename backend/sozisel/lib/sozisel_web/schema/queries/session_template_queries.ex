defmodule SoziselWeb.Schema.Queries.SessionTemplateQueries do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.{Middleware, Resolvers.SessionTemplateResolvers}

  object :session_template_queries do
    field :session_template, :session_template do
      arg :id, non_null(:id)

      middleware Middleware.Authorization
      resolve &SessionTemplateResolvers.get_session_template/3
    end

    field :search_session_templates, strong_list_of(:session_template) do
      arg :include_public, :boolean, default_value: false
      arg :name, :string, default_value: ""

      middleware Middleware.Authorization
      resolve &SessionTemplateResolvers.search/3
    end
  end
end
