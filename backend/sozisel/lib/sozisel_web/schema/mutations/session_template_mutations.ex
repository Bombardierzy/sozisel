defmodule SoziselWeb.Schema.Mutations.SessionTemplateMutations do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.Sessions.Template
  alias SoziselWeb.Schema.{Middleware, Resolvers.SessionTemplateResolvers}

  object :session_template_mutations do
    field :create_session_template, :session_template do
      arg :input, non_null(:create_session_template_input)

      middleware Middleware.Authorization
      resolve &SessionTemplateResolvers.create/3
    end

    field :update_session_template, :session_template do
      arg :input, non_null(:update_session_template_input)

      middleware Middleware.ResourceAuthorization, {:update_session_template, Template}
      resolve &SessionTemplateResolvers.update/3
    end

    field :delete_session_template, :session_template do
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:delete_session_template, Template}
      resolve &SessionTemplateResolvers.delete/3
    end

    field :clone_session_template, :session_template do
      arg :id, non_null(:id)

      middleware Middleware.ResourceAuthorization, {:clone_session_template, Template}
      resolve &SessionTemplateResolvers.clone/3
    end
  end
end
