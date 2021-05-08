defmodule SoziselWeb.Schema.Queries.UserQueries do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.{Middleware, Resolvers}
  alias Resolvers.UserResolvers

  object :user_queries do
    field :me, non_null(:me) do
      middleware(Middleware.Authorization)
      resolve(&UserResolvers.me/3)
    end
  end
end
