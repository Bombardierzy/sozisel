defmodule SoziselWeb.Schema.Types.SessionResourceTypes do
  use SoziselWeb.Schema.Notation

  object :session_resource do
    @desc "Session resource's id"
    field :id, non_null(:id)
    field :path, non_null(:string)
    field :filename, non_null(:string)
  end

  input_object :session_resource_link_input do
    field :resource_id, non_null(:id)
    field :session_id, non_null(:id)
    field :is_public, :boolean, default_value: false
  end

  object :session_resource_link do
    @desc "Session resource link's id"
    field :id, non_null(:id)
    field :is_public, non_null(:boolean)

    field :session_resource, non_null(:session_resource) do
      resolve dataloader(:db)
    end
  end
end
