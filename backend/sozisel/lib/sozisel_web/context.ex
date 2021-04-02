defmodule SoziselWeb.Context do
  @moduledoc """
  Module responsible for carrying Absinthe's context specific information like
  currently authorized user, dataloader, ect.
  """

  @behaviour Plug

  import Plug.Conn
  import Ecto.Query, only: [where: 2]

  alias Sozisel.Repo
  alias Sozisel.Model.User

  require Logger

  def init(opts), do: opts

  def call(conn, _) do
    context = build_context(conn)
    Absinthe.Plug.put_options(conn, context: context)
  end

  @doc """
  Return the current user context based on the authorization header
  """
  def build_context(conn) do
    user =
      with ["Bearer " <> token] <- get_req_header(conn, "authorization"),
           {:ok, user} <- authorize(token) do
        user
      else
        {:error, :invalid_token} ->
          Logger.warn("Failed to authorize user, invalid token")
          nil

        _ ->
          nil
      end

    %{current_user: user}
  end

  defp authorize(token) do
    Sozisel.Model.Users.Token.retrieve_user(token)
  end
end
