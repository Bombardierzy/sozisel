defmodule SoziselWeb.Schema.Resolvers.SessionTemplateResolvers do
  alias SoziselWeb.Context
  alias Sozisel.Model.{Sessions, Sessions.Template}

  import SoziselWeb.Schema.Middleware.ResourceAuthorization, only: [fetch_resource!: 2]

  def get_session_template(_parent, %{id: id}, ctx) do
    user_id = Context.current_user!(ctx).id

    with %Template{user_id: ^user_id} = template <- Sessions.get_template(id) do
      {:ok, template}
    else
      %Template{} -> {:error, :unauthorized}
      nil -> {:ok, nil}
    end
  end

  def create(_parent, %{input: input}, ctx) do
    user = Context.current_user!(ctx)

    input
    |> Map.put(:user_id, user.id)
    |> Sessions.create_template_with_agenda_and_events()
  end

  def update(_parent, %{input: input}, ctx) do
    fetch_resource!(ctx, Template)
    |> Sessions.update_template_with_agenda(input)
  end

  def delete(_parent, _args, ctx) do
    fetch_resource!(ctx, Template)
    |> Sessions.delete_template()
  end

  def clone(_parent, _args, ctx) do
    user = Context.current_user!(ctx)

    fetch_resource!(ctx, Template)
    |> Sessions.clone_template(user)
  end

  def search(_parent, %{include_public: include_public, name: name}, ctx) do
    if include_public do
      {:ok, Sessions.list_session_templates(is_public: true, name: name, deleted: false)}
    else
      user = Context.current_user!(ctx)
      {:ok, Sessions.list_session_templates(user_id: user.id, name: name, deleted: false)}
    end
  end
end
