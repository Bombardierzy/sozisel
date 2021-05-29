defmodule SoziselWeb.Schema.Middleware.Subscriptions.Presenter do
  @behaviour SoziselWeb.Schema.Middleware.Subscription

  alias Sozisel.Model.{Users.User, Sessions.Session}
  alias Sozisel.Repo

  @impl true
  def call(%{session_id: session_id}, ctx, _opts) do
    with %{context: %{current_user: %User{id: user_id}}} <- ctx,
         %Session{user_id: ^user_id} <- Repo.get(Session, session_id) do
      {:ok, ctx}
    else
      _ ->
        {:error, "unauthorized"}
    end
  end
end
