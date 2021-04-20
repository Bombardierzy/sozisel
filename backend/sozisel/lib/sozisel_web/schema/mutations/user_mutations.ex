defmodule SoziselWeb.Schema.Mutations.UserMutations do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.Resolvers.UserResolvers

  object :user_mutations do
    field :register, :user do
      arg(:input, non_null(:register_input))
      resolve(&UserResolvers.register/3)
    end

    field :login, :login_result do
      arg(:input, non_null(:login_input))
      resolve(&UserResolvers.login/3)
    end
  end
end
