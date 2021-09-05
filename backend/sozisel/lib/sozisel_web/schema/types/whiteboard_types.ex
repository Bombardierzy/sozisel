defmodule SoziselWeb.Schema.Types.WhiteboardTypes do
  use SoziselWeb.Schema.Notation

  object :whiteboard do
    field :task, non_null(:string)
  end

  input_object :whiteboard_input do
    field :task, non_null(:string)
  end

  input_object :create_whiteboard_input do
    import_fields :create_event_input_base

    field :event_data, non_null(:whiteboard_input)
  end

  input_object :update_whiteboard_input do
    import_fields :update_event_input_base

    field :event_data, non_null(:whiteboard_input)
  end

  object :whiteboard_result do
    field :path, non_null(:string)
    field :text, :string
    field :used_time, non_null(:float)
  end

  input_object :whiteboard_result_input do
    field :launched_event_id, non_null(:id)

    field :image, non_null(:upload)
    field :path, non_null(:string)
    @desc "Here, the user can write a short note explaining the meaning or something else"
    field :text, :string
    field :used_time, non_null(:float)
  end
end
