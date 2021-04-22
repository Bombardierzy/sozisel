defmodule SoziselWeb.Schema.Queries.UserQueries do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.{Middlewares, Resolvers}
  alias Resolvers.UserResolvers

  object :user_queries do
    field :me, non_null(:me) do
      middleware(Middlewares.Authorization)
      resolve(&UserResolvers.me/3)
    end
  end
end
