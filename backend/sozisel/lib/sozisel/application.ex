defmodule Sozisel.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  require Logger

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Sozisel.Repo,
      # Start the Telemetry supervisor
      SoziselWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Sozisel.PubSub},
      {Registry, name: Sozisel.SharedWhiteboard.registry(), keys: :unique},
      # Start Presence
      SoziselWeb.Presence,
      # Start the Endpoint (http/https)
      SoziselWeb.Endpoint,
      # Start absinthe subscriptions handler
      {Absinthe.Subscription, SoziselWeb.Endpoint}
    ]

    opts = [strategy: :one_for_one, name: Sozisel.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def start_phase(:auto_migrate, :normal, _opts) do
    has_errors =
      Application.fetch_env!(:sozisel, :ecto_repos)
      |> Enum.map(fn repo ->
        result =
          repo
          |> Ecto.Migrator.with_repo(&Ecto.Migrator.run(&1, :up, all: true))

        {repo, result}
      end)
      |> Enum.map(fn {repo, result} ->
        with {:ok, _, _} <- result do
          Logger.info("#{repo} has been migrated.")
        end
      end)
      |> Enum.any?(&match?({:error, _}, &1))

    if has_errors do
      {:error, "failed to migrate repositories"}
    else
      :ok
    end
  end

  @impl true
  def config_change(changed, _new, removed) do
    SoziselWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
