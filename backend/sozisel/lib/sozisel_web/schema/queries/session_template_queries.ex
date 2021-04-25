defmodule SoziselWeb.Schema.Queries.SessionTemplateQueries do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.{Middlewares, Resolvers.SessionTemplateResolvers}

  object :session_template_queries do
    field :search_session_templates, strong_list_of(:session_template) do
      arg :include_public, :boolean, default_value: false
      arg :name, :string, default_value: ""

      middleware Middlewares.Authorization
      resolve &SessionTemplateResolvers.search/3
    end
  end
end
