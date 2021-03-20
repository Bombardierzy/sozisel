defmodule Sozisel.Repo do
  use Ecto.Repo,
    otp_app: :sozisel,
    adapter: Ecto.Adapters.Postgres
end
