defmodule SoziselWeb.Schema.Types.PollTypes do
  use SoziselWeb.Schema.Notation

  object :poll_option do
    field :id, non_null(:id)
    field :text, non_null(:string)
  end

  object :poll do
    field :question, non_null(:string)
    field :options, strong_list_of(:poll_option)
    field :is_multi_choice, non_null(:boolean)
  end

  input_object :poll_option_input do
    field :id, non_null(:id)
    field :text, non_null(:string)
  end

  input_object :poll_input do
    field :question, non_null(:string)
    field :options, strong_list_of(:poll_option_input)
    field :is_multi_choice, :boolean, default_value: false
  end

  input_object :create_poll_input do
    import_fields :create_event_input_base

    field :event_data, non_null(:poll_input)
  end

  input_object :update_poll_input do
    import_fields :update_event_input_base

    field :event_data, non_null(:poll_input)
  end

  object :poll_result do
    field :option_ids, strong_list_of(:id)
  end

  input_object :poll_result_input do
    field :launched_event_id, non_null(:id)

    @desc "when multi choice is not enabled then it expects a list with a single option"
    field :poll_option_ids, strong_list_of(:id)
  end

  object :poll_option_summary do
    field :id, non_null(:id)
    field :text, non_null(:string)
    field :votes, non_null(:integer)
  end

  object :poll_summary do
    @desc "ID of associated launched event"
    field :id, non_null(:id)

    field :question, non_null(:string)
    field :option_summaries, strong_list_of(:poll_option_summary)
    field :is_multi_choice, non_null(:boolean)

    @desc "Total number of poll voters, one voter could vote for more than one option if multi choice is enabled"
    field :total_voters, non_null(:integer)
  end
end
