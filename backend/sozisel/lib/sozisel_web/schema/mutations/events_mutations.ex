defmodule SoziselWeb.Schema.Mutations.EventMutations do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.{Resolvers.EventResolvers}

  object :event_mutations do
    field :create_event, :event do
      arg :input, non_null(:create_event_input)

      resolve &EventResolvers.create/3
    end

    field :update_event, :event do
      arg :input, non_null(:update_event_input)

      resolve &EventResolvers.update/3
    end

    field :delete_event, :event do
      arg :id, non_null(:id)
      resolve &EventResolvers.delete/3
    end

    field :clone_event, :event do
      arg :id, non_null(:id)
      resolve &EventResolvers.clone/3
    end
  end
end