defmodule SoziselWeb.Schema.Queries.UserQueries do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.{Middleware, Resolvers}
  alias Resolvers.UserResolvers

  object :user_queries do
    field :me, non_null(:me) do
      middleware(Middleware.Authorization)
      resolve(&UserResolvers.me/3)
    end

    field :generate_jitsi_token, non_null(:jitsi_token) do
      arg :room_id, non_null(:id)
      arg :email, non_null(:string)
      arg :display_name, non_null(:string)

      resolve fn _parent, %{room_id: room_id, email: email, display_name: display_name}, _ctx ->
        {:ok, token} = Sozisel.JitsiTokenGenerator.generate(room_id, email, display_name)
        {:ok, %{token: token, email: email, display_name: display_name}}
      end
    end
  end
end
