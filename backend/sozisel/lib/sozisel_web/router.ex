defmodule SoziselWeb.Router do
  use SoziselWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api" do
    pipe_through :api

    forward "/graphiql",
            Absinthe.Plug.GraphiQL,
            schema: SoziselWeb.Schema,
            socket: SoziselWeb.UserSocket,
            interface: :playground

    forward "/", Absinthe.Plug
  end

  # live dashboard for development
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through [:fetch_session, :protect_from_forgery]
      live_dashboard "/dashboard", metrics: SoziselWeb.Telemetry
    end
  end
end
