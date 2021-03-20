defmodule SoziselWeb.Schema do
  use Absinthe.Schema

  # Types
  import_types(SoziselWeb.Schema.Types.HelloTypes)

  # Queries
  import_types(SoziselWeb.Schema.Queries.HelloQueries)

  # Mutations
  import_types(SoziselWeb.Schema.Mutations.HelloMutations)

  # Subscriptionis
  import_types(SoziselWeb.Schema.Subscriptions.HelloSubscriptions)

  query do
    import_fields(:hello_queries)
  end

  mutation do
    import_fields(:hello_mutations)
  end

  subscription do
    import_fields(:hello_subscriptions)
  end

  def plugins do
    [Absinthe.Middleware.Dataloader | Absinthe.Plugin.defaults()]
  end
end
