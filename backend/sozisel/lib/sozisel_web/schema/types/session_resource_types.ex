defmodule SoziselWeb.Schema.Types.SessionResourceTypes do
  use SoziselWeb.Schema.Notation

  object :file do
    field :id, non_null(:id)
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
    field :is_public, :boolean, default_value: false
  end

  object :session_resource_for_presenter do
    @desc "Session resource's id"
    field :id, non_null(:id)
    field :is_public, non_null(:boolean)
    field :filename, non_null(:string)
  end

  object :session_resource_for_participant do
    @desc "Session resource link's id"
    field :id, non_null(:id)
    field :filename, non_null(:string)
  end

  object :download_session_resource do
    @desc "Session resource's id"
    field :id, non_null(:id)
    field :path, non_null(:string)
  end
end
