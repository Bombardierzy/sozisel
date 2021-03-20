defmodule Sozisel.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Sozisel.Repo,
      # Start the Telemetry supervisor
      SoziselWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Sozisel.PubSub},
      # Start the Endpoint (http/https)
      SoziselWeb.Endpoint,
      # Start absinthe subscriptions handler
      {Absinthe.Subscription, SoziselWeb.Endpoint}
    ]

    opts = [strategy: :one_for_one, name: Sozisel.Supervisor]
    Supervisor.start_link(children, opts)
  end

  def config_change(changed, _new, removed) do
    SoziselWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
