defmodule Sozisel.MixProject do
  use Mix.Project

  def project do
    [
      app: :sozisel,
      version: "0.1.0",
      elixir: "~> 1.12",
      elixirc_paths: elixirc_paths(Mix.env()),
      compilers: [:phoenix, :gettext] ++ Mix.compilers(),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  def application do
    [
      mod: {Sozisel.Application, []},
      extra_applications: [:logger, :runtime_tools],
      start_phases: [auto_migrate: []]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  defp deps do
    [
      {:phoenix, "~> 1.5.8"},
      {:phoenix_ecto, "~> 4.1"},
      {:ecto_sql, "~> 3.4"},
      {:postgrex, ">= 0.0.0"},
      {:phoenix_live_dashboard, "~> 0.4"},
      {:telemetry_metrics, "~> 0.4"},
      {:telemetry_poller, "~> 0.4"},
      {:gettext, "~> 0.11"},
      {:joken, "~> 2.3"},
      {:jason, "~> 1.0"},
      {:plug_cowboy, "~> 2.0"},
      {:absinthe, "~> 1.6"},
      {:absinthe_plug, "~> 1.5"},
      {:dataloader, "~> 1.0.0"},
      {:absinthe_phoenix, "~> 2.0.0"},
      {:cors_plug, "~> 2.0"},
      {:bcrypt_elixir, "~> 2.3"},
      {:guardian, "~> 2.1"},
      {:ex_machina, "~> 2.7.0"},
      {:crudry, "~> 2.3.1"},
      {:polymorphic_embed, "~> 1.3.4"},
      {:bodyguard, "~> 2.4"},
      {:ffmpex, "~> 0.7.3"}
    ]
  end

  defp aliases do
    [
      setup: ["deps.get", "ecto.setup"],
      "ecto.seeds": ["run priv/repo/seeds.exs"],
      "ecto.setup": ["ecto.create", "ecto.migrate"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"]
    ]
  end
end
