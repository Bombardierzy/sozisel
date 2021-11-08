import Config

if config_env() == :prod do
  config :sozisel, SoziselWeb.Endpoint,
    # TODO host must be the server_ip injected in dokcer-compose and .env file
    url: [host: System.fetch_env!("HOST"), port: System.fetch_env!("PORT")],
    http: [
      port: String.to_integer(System.fetch_env!("PORT") || "4000"),
      transport_options: [socket_opts: [:inet6]]
    ],
    secret_key_base: System.fetch_env!("SECRET_KEY_BASE")

  config :sozisel, Sozisel.Repo,
    url: System.fetch_env!("DATABASE_URL"),
    port: System.fetch_env!("DATABASE_PORT"),
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")
end
