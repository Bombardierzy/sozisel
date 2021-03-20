use Mix.Config

config :sozisel, Sozisel.Repo,
  username: "postgres",
  password: "postgres",
  database: "sozisel_test#{System.get_env("MIX_TEST_PARTITION")}",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

config :sozisel, SoziselWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn
