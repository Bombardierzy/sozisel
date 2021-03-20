defmodule SoziselWeb.Schema.Resolvers.HelloResolvers do
  def hello(_parent, %{from: from}, _ctx) do
    message = "Hello there #{from}!"

    Absinthe.Subscription.publish(SoziselWeb.Endpoint, %{message: message}, [
      {:hello_messages, "hello_message"}
    ])

    {:ok, %{message: message}}
  end
end
