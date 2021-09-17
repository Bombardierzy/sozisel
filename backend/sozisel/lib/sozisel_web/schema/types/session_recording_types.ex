defmodule SoziselWeb.Schema.Types.SessionRecordingTypes do
  use SoziselWeb.Schema.Notation

  object :recording_annotation do
    field :id, non_null(:id)
    field :timestamp, non_null(:integer)
    field :label, non_null(:string)
  end

  input_object :recording_annotation_input do
    field :id, non_null(:id)
    field :timestamp, non_null(:integer)
    field :label, non_null(:string)
  end

  object :session_recording do
    field :id, non_null(:id)
    @desc "Relative path under which the media object should be accessed."
    field :path, non_null(:string)
    field :annotations, strong_list_of(:recording_annotation)
  end
end
