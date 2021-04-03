defmodule SoziselWeb.Schema.HelloTest do
  use SoziselWeb.AbsintheCase

  @query """
  query {
    hello {
      message
    }
  }
  """

  @mutation """
  mutation HelloMutation($from: String!) {
    hello(from: $from) {
      message
    }
  }
  """

  @subscription """
  subscription {
    helloMessages {
      message
    }
  }
  """

  setup do
    [conn: test_conn(), socket: test_socket()]
  end

  test "running query", ctx do
    assert %{
             data: %{
               "hello" => %{"message" => "Hello there!"}
             }
           } = run_query(ctx.conn, @query, %{})
  end

  test "running mutation", ctx do
    assert %{
             data: %{
               "hello" => %{
                 "message" => "Hello there me!"
               }
             }
           } = run_query(ctx.conn, @mutation, %{from: "me"})
  end

  test "running subscription", ctx do
    sub_id = run_subscription(ctx.socket, @subscription, %{})

    run_query(ctx.conn, @mutation, %{from: "me"})

    assert %{
             data: %{
               "helloMessages" => %{
                 "message" => "Hello there me!"
               }
             }
           } = receive_subscription(sub_id)
  end
end
