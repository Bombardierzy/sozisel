defmodule SoziselWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :sozisel
  use Absinthe.Phoenix.Endpoint

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  @session_options [
    store: :cookie,
    key: "_sozisel_key",
    signing_salt: "z3XWlbLB"
  ]

  socket "/api/socket", SoziselWeb.UserSocket,
    websocket: true,
    longpoll: false

  plug Plug.Static,
    at: "/api/recording",
    from: Application.fetch_env!(:sozisel, SoziselWeb.MediaUpload) |> Keyword.fetch!(:upload_path)

  plug Plug.Static,
    at: "/api/image",
    from:
      Application.fetch_env!(:sozisel, SoziselWeb.MediaUpload)
      |> Keyword.fetch!(:upload_path)

  plug Plug.Static,
    at: "/api/session_resource",
    from:
      Application.fetch_env!(:sozisel, SoziselWeb.MediaUpload)
      |> Keyword.fetch!(:upload_path)

  if code_reloading? do
    plug Phoenix.CodeReloader
    plug Phoenix.Ecto.CheckRepoStatus, otp_app: :sozisel
  end

  plug Phoenix.LiveDashboard.RequestLogger,
    param_key: "request_logger",
    cookie_key: "request_logger"

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Parsers,
    parsers: [
      :urlencoded,
      # Allow up to 300MB
      {:multipart, length: 300_000_000},
      :json,
      Absinthe.Plug.Parser
    ],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug Plug.MethodOverride
  plug Plug.Head
  plug Plug.Session, @session_options
  plug SoziselWeb.Router
end
