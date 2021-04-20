defmodule SoziselWeb.Schema.Subscriptions.HelloSubscriptions do
  use SoziselWeb.Schema.Notation

  object :hello_subscriptions do
    field :hello_messages, type: :hello_message do
      config(fn _args, _context ->
        {:ok, topic: "hello_message"}
      end)
    end
  end
end
