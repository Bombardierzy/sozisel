defmodule SoziselWeb.AbsintheCase do
  @moduledoc """
  This module defines the setup for tests requiring
  absinthe setup.

  Tests will contain several things necessary for performing queries/mutations/subscriptions.

  For queries/mutations this module will create a `Plug.Conn` that can be passed to functions performing queries/mutations.

  For subscriptions this module will create a phoenix socket that can be then used to start subscriptions and receiving results on them.

  Database setup will be done just like with `data_case.ex`
  """

  use ExUnit.CaseTemplate

  require Phoenix.ChannelTest
  require Phoenix.ConnTest
  @endpoint SoziselWeb.Endpoint

  using do
    quote do
      import SoziselWeb.AbsintheCase

      alias Sozisel.Repo

      import Ecto
      import Ecto.Changeset
      import Ecto.Query
      import Sozisel.DataCase

      import Plug.Conn
      import Phoenix.ConnTest
      import SoziselWeb.ConnCase

      alias SoziselWeb.Router.Helpers, as: Routes
      alias Absinthe.Phoenix.SubscriptionTest
      alias Sozisel.Model.Users.Token

      require Phoenix.ChannelTest
      require Phoenix.ConnTest
      @endpoint SoziselWeb.Endpoint

      @doc """
      Creates a test connection that can be used to perform query/mutations.

      ## Arguments
      * `user` - optional user that will be used to authorize connection
      """
      @spec test_conn(Sozisel.Model.Users.User.t() | nil) :: Plug.Conn.t()
      def test_conn(user \\ nil) do
        conn =
          Phoenix.ConnTest.build_conn()
          |> Plug.Conn.put_req_header("content-type", "application/json")

        with %Sozisel.Model.Users.User{} <- user do
          token = Sozisel.Model.Users.Token.generate(user)

          conn |> Plug.Conn.put_req_header("authorization", "Bearer " <> token)
        else
          _ -> conn
        end
      end

      @doc """
      Creates a test socket that can be used to perform subscriptions and receive results.

      ## Arguments
      * `user` - optional user that will be used to authorize socket
      """
      @spec test_socket(Sozisel.Model.Users.User.t() | nil) :: Phoenix.Socket.t()
      def test_socket(user \\ nil) do
        token =
          with %Sozisel.Model.Users.User{} <- user do
            Token.generate(user)
          else
            _ ->
              nil
          end

        {:ok, socket} = Phoenix.ChannelTest.connect(SoziselWeb.UserSocket, %{"token" => token})
        {:ok, socket} = SubscriptionTest.join_absinthe(socket)
        socket
      end

      setup tags do
        :ok = Ecto.Adapters.SQL.Sandbox.checkout(Sozisel.Repo)

        unless tags[:async] do
          Ecto.Adapters.SQL.Sandbox.mode(Sozisel.Repo, {:shared, self()})
        end

        :ok
      end
    end
  end

  @doc """
  Performs graphql query/mutation on given connection.

  ## Arguments
  * `conn` - connection used to perform query
  * `query` - document string containing query/mutation
  * `variables` - variables used to execute document
  """
  @spec run_query(Plug.Conn.t(), query :: String.t(), variables :: map()) :: %{
          data: any(),
          errors: any()
        }
  def run_query(conn, query, variables) do
    %Plug.Conn{resp_body: body} =
      conn
      |> Phoenix.ConnTest.post("/api/graphql", %{
        "query" => query,
        "variables" => variables
      })

    # just a little hack to make it compatible with subscriptions
    result = Phoenix.json_library().decode!(body)
    %{data: Map.get(result, "data", nil), errors: Map.get(result, "errors", nil)}
  end

  @doc """
  Performs subscription on given socket returning subscription identifier that can be further used
  to awaiting on subscription responses.

  ## Arguments
  * `socket` - socket used to perform subscription
  * `query` - document string containing subscription
  * `variables` - variables passed to execute document
  """
  @spec run_subscription(Phoenix.Socket.t(), query :: String.t(), variables :: map()) ::
          String.t()
  def run_subscription(socket, query, variables) do
    ref = Absinthe.Phoenix.SubscriptionTest.push_doc(socket, query, variables: variables)

    receive do
      %Phoenix.Socket.Reply{
        payload: %{subscriptionId: sub_id},
        ref: ^ref,
        status: :ok
      } ->
        sub_id

      %Phoenix.Socket.Reply{
        payload: payload,
        ref: ^ref,
        status: :error
      } ->
        payload
    after
      500 ->
        raise "failed to run subscription, timeout reached"
    end
  end

  @doc """
  Awaits on given subscription to receive a message.
  Expected to be run in the same process that subscription has been started.

  ## Arguments
  * `subscription_id` - subscription to listen on
  * `timeout` - timeout interval after which waiting will raise
  """
  @spec receive_subscription(String.t(), non_neg_integer()) :: %{data: any(), errors: any()}
  def receive_subscription(subscription_id, timeout \\ 500) do
    receive do
      %Phoenix.Socket.Message{
        event: "subscription:data",
        payload: %{
          subscriptionId: ^subscription_id,
          result: result
        },
        topic: ^subscription_id,
        join_ref: nil,
        ref: nil
      } ->
        result
    after
      timeout ->
        raise "timeout reached when awaiting for subscription result"
    end
  end
end
