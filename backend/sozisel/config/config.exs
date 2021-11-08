# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :sozisel,
  ecto_repos: [Sozisel.Repo]

config :sozisel, Sozisel.Repo,
  migration_primary_key: [name: :id, type: :binary_id],
  migration_timestamps: [type: :utc_datetime_usec]

# Configures the endpoint
config :sozisel, SoziselWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "5ZddLiYfufVtVfpB2ZxEpmulcNDXTaVWaoJAeg9Tr0MzZ3yntRFeAZF21i/Gv5IE",
  render_errors: [view: SoziselWeb.ErrorView, accepts: ~w(json), layout: false],
  pubsub_server: Sozisel.PubSub,
  live_view: [signing_salt: "9+uRncbw"]

config :sozisel, Sozisel.Model.Users.Token,
  issuer: "sozisel",
  secret_key: "cSYEgyeugeMk3s8BtFO93HBQQdJeSyUlgO8FP3jWPZQWDpm5FImpQIz+mHwiqv/X",
  ttl: {7 * 24, :hours}

config :sozisel, Sozisel.JitsiTokenGenerator,
  issuer: "sozisel_app",
  secret_key: "9mrcPkvUfoqzuHrfQfP/ExOynZgpL7w"

config :sozisel, SoziselWeb.MediaUpload, upload_path: "/tmp/"

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
