import Config

config :logger, level: :info

config :sozisel, SoziselWeb.Endpoint, server: true

config :sozisel, SoziselWeb.MediaUpload, upload_path: "/data/resources/"
