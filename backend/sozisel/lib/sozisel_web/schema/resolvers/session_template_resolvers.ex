defmodule SoziselWeb.Schema.Resolvers.SessionTemplateResolvers do
  alias SoziselWeb.Context
  alias Sozisel.Model.{Sessions, Sessions.Template}

  def create(_parent, %{input: input}, ctx) do
    user = Context.current_user!(ctx)

    Sessions.create_template_with_agenda(input |> Map.put(:user_id, user.id))
  end

  def update(_parent, %{input: input}, ctx) do
    user = Context.current_user!(ctx)

    with %Template{} = template <- Sessions.get_template(input.id),
         true <- template.user_id == user.id do
      Sessions.update_template_with_agenda(template, input)
    else
      nil ->
        {:error, "sessions template not found"}

      false ->
        {:error, "unauthorized"}
    end
  end

  def delete(_parent, %{id: id}, ctx) do
    user = Context.current_user!(ctx)

    with %Template{} = template <- Sessions.get_template(id),
         true <- template.user_id == user.id do
      Sessions.delete_template(template)
    else
      nil ->
        {:error, "sessions template not found"}

      false ->
        {:error, "unauthorized"}
    end
  end
end
