defmodule SoziselWeb.Schema.Mutations.SessionTemplateMutations do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.{Middlewares, Resolvers.SessionTemplateResolvers}

  object :session_template_mutations do
    field :create_session_template, :session_template do
      arg :input, non_null(:create_session_template_input)

      middleware Middlewares.Authorization
      resolve &SessionTemplateResolvers.create/3
    end

    field :update_session_template, :session_template do
      arg :input, non_null(:update_session_template_input)

      middleware Middlewares.Authorization
      resolve &SessionTemplateResolvers.update/3
    end

    field :delete_session_template, :session_template do
      arg :id, non_null(:id)
      middleware Middlewares.Authorization
      resolve &SessionTemplateResolvers.delete/3
    end
  end
end
