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
    @desc "Relative path under which the media object should be accessed."
    field :path, non_null(:string)
    field :text, :string
    field :used_time, non_null(:float)
  end

  input_object :whiteboard_result_input do
    field :launched_event_id, non_null(:id)

    field :image, non_null(:upload)
    @desc "An optional note that user can add to explain meaning of the uploaded result"
    field :text, :string
    field :used_time, non_null(:float)
  end

  object :participants_whiteboard_task_summary do
    field :full_name, non_null(:string)
    field :email, non_null(:string)
    field :image_path, non_null(:string)
    field :used_time, non_null(:float)
    field :additional_text, :string
  end

  object :whiteboard_summary do
    @desc "ID of associated launched event"
    field :id, non_null(:id)

    field :task, non_null(:string)
    field :participants_whiteboard_tasks, strong_list_of(:participants_whiteboard_task_summary)
    field :average_used_time, non_null(:float)
  end
end
