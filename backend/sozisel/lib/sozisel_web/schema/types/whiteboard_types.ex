defmodule SoziselWeb.Schema.Types.WhiteboardTypes do
  use SoziselWeb.Schema.Notation

  object :whiteboard do
    field :task, non_null(:string)
  end

#   object :poll_result do
#     field :option_ids, strong_list_of(:id)
#   end

#   object :poll_summary do
#     @desc "ID of associated launched event"
#     field :id, non_null(:id)

#     field :question, non_null(:string)
#     field :option_summaries, strong_list_of(:poll_option_summary)
#     field :is_multi_choice, non_null(:boolean)

#     @desc "Total number of poll voters, one voter could vote for more than one option if multi choice is enabled"
#     field :total_voters, non_null(:integer)
#   end

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

#   input_object :poll_result_input do
#     field :launched_event_id, non_null(:id)

#     @desc "when multi choice is not enabled then it expects a list with a single option"
#     field :poll_option_ids, strong_list_of(:id)
#   end
end
