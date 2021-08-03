defmodule SoziselWeb.Context do
  @moduledoc """
  Module responsible for carrying Absinthe's context specific information like
  currently authorized user, dataloader, ect.
  """

  @behaviour Plug

  import Plug.Conn

  require Logger

  @impl true
  def init(opts), do: opts

  @impl true
  def call(conn, _) do
    context = build_context(conn)

    Absinthe.Plug.put_options(conn,
      context: context |> Map.put(:loader, SoziselWeb.Dataloader.new())
    )
  end

  def create_socket_context(%Phoenix.Socket{} = socket, params) do
    context = build_context(params)

    # WARNING: If anything related to dataloader breaks it is due to creating a single dataloader instance for a socket,
    # it caches the results therefore it may return invalid data. If anything like this happens then go and change
    # dataloader creation per every mutation/query/subscription call instead of keeping it always inside context.
    # We are using it just for subscriptions so there should not be any problems though (I hope so).
    socket =
      Absinthe.Phoenix.Socket.put_options(socket,
        context: context |> Map.put(:loader, SoziselWeb.Dataloader.new())
      )

    {:ok, socket}
  end

  @doc """
  Return the current user context based on the authorization header
  """
  def build_context(%Plug.Conn{} = conn) do
    user =
      with ["Bearer " <> token] <- get_req_header(conn, "authorization"),
           {:ok, user} <- authorize(token) do
        user
      else
        {:error, :invalid_token} ->
          Logger.warn("Failed to authorize user, invalid token")
          nil

        _ ->
          Logger.warn("Bearer token is missing in authorization params...")
          nil
      end

    %{current_user: user}
  end

  # used for building context for socket
  def build_context(%{"token" => token}) do
    user =
      with {:ok, user} <- authorize(token) do
        user
      else
        {:error, :invalid_token} ->
          Logger.warn("Failed to authorize user, invalid token")
          nil
      end

    %{current_user: user}
  end

  def build_context(_args) do
    Logger.warn("Context has been created without any parameters...")
    %{}
  end

  def current_user!(%{context: %{current_user: user}}) when not is_nil(user) do
    user
  end

  defp authorize(token) do
    Sozisel.Model.Users.Token.retrieve_user(token)
  end
end
