defmodule SoziselWeb.Presence do
  use Phoenix.Presence,
    otp_app: :sozisel,
    pubsub_server: Sozisel.PubSub
end
