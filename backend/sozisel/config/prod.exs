use Mix.Config

config :sozisel, SoziselWeb.Endpoint,
  # TODO host must be the server_ip injected in dokcer-compose and .env file
  url: [host: "example.pl", port: 4000],
  cache_static_manifest: "priv/static/cache_manifest.json"

# Do not print debug messages in production
config :logger, level: :info

import_config "prod.secret.exs"
