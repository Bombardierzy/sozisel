defmodule SoziselWeb.Schema.Resolvers.UserResolvers do
  alias Sozisel.Model.{Users, Users.User}
  alias Sozisel.Repo

  def me(_parent, _args, %{context: %{current_user: user}}) do
    {:ok, user}
  end

  def register(_parent, %{input: input}, _ctx) do
    with {:ok, %User{} = user} <- Users.create_user(input) do
      {:ok, user}
    end
  end

  def login(_parent, %{input: %{email: email, password: password}}, _ctx) do
    with %User{} = user <- Repo.get_by(User, email: email),
         {:ok, user} <- Users.Security.verify_user(user, password),
         token = Users.Token.generate(user) do
      {:ok, %{token: token}}
    else
      _ ->
        {:error, "unauthorized"}
    end
  end
end
