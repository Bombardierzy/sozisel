use Config

if config_env() == :prod do
  config :sozisel, SoziselWeb.Endpoint,
    # TODO host must be the server_ip injected in dokcer-compose and .env file
    url: [host: System.fetch_env!("HOST"), port: System.fetch_env!("PORT")],
    secret_key_base: System.fetch_env!("SECRET_KEY_BASE")

  config :sozisel, Sozisel.Repo,
    username: System.fetch_env!("POSTGRES_USER"),
    password: System.fetch_env!("POSTGRES_PASS"),
    database: System.fetch_env!("POSTGRES_DB"),
    hostname: System.fetch_env!("POSTGRES_HOST"),
    port: System.fetch_env!("POSTGRES_PORT"),
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")
end
