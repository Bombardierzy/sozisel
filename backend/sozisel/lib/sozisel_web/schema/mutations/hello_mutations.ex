defmodule SoziselWeb.Schema.Mutations.HelloMutations do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.Resolvers.HelloResolvers

  object :hello_mutations do
    field :hello, non_null(:hello_message) do
      arg(:from, non_null(:string))

      resolve(&HelloResolvers.hello/3)
    end
  end
end
