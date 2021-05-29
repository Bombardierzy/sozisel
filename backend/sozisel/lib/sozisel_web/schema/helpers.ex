defmodule SoziselWeb.Schema.Helpers do
  @spec subscription_publish(subscription_name :: atom(), topic :: String.t(), data :: map()) ::
          :ok
  def subscription_publish(subscription_name, topic, data) do
    Absinthe.Subscription.publish(SoziselWeb.Endpoint, data, [{subscription_name, topic}])
  end
end
