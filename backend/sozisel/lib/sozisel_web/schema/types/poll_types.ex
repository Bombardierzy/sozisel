defmodule SoziselWeb.Schema.Types.PollTypes do
  use SoziselWeb.Schema.Notation

  object :poll_option do
    field :id, non_null(:id)
    field :text, non_null(:string)
  end

  object :poll do
    field :question, non_null(:string)
    field :options, strong_list_of(:poll_option)
  end

  object :poll_result do
    field :option_id, non_null(:id)
  end

  object :poll_option_summary do
    field :id, non_null(:id)
    field :text, non_null(:string)
    field :votes, non_null(:integer)
  end

  object :poll_summary do
    field :id, non_null(:id)
    field :option_summaries, strong_list_of(:poll_option_summary)
  end

  input_object :poll_option_input do
    field :id, non_null(:id)
    field :text, non_null(:string)
  end

  input_object :poll_input do
    field :question, non_null(:string)
    field :options, strong_list_of(:poll_option_input)
  end

  input_object :create_poll_input do
    field :session_template_id, non_null(:id)
    field :name, non_null(:string)
    field :start_minute, non_null(:integer)
    field :event_data, non_null(:poll_input)
  end

  input_object :update_poll_input do
    field :id, non_null(:string)
    field :name, :string
    field :start_minute, :integer
    field :event_data, :poll_input
  end

  input_object :poll_result_input do
    field :launched_event_id, non_null(:id)
    field :poll_option_id, non_null(:id)
  end
end
