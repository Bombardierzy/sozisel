defmodule SoziselWeb.Schema.Types.EventTypes do
  use SoziselWeb.Schema.Notation

  object :event do
    field :id, non_null(:id)
    field :name, non_null(:string)
    field :start_minute, non_null(:integer)
    field :event_type, non_null(:quiz)
    field :session_template_id, non_null(:string)

    timestamps()
  end

  object :quiz do
    field :duration_time_sec, non_null(:integer)
    field :target_percentage_of_participants, non_null(:integer)
    field :tracking_mode, non_null(:boolean)
    field :quiz_questions, non_null(list_of(:quiz_question))
  end

  object :quiz_question do
    field :question, non_null(:string)
    field :answers, non_null(list_of(:string))
    field :correct_answers, non_null(list_of(:string))
  end

  input_object :quiz_input do
    field :duration_time_sec, non_null(:integer)
    field :target_percentage_of_participants, non_null(:integer)
    field :tracking_mode, non_null(:boolean)
    field :quiz_questions, non_null(list_of(:quiz_question_input))
  end

  input_object :quiz_question_input do
    field :question, non_null(:string)
    field :answers, non_null(list_of(:string))
    field :correct_answers, non_null(list_of(:string))
  end

  input_object :create_event_input do
    field :name, non_null(:string)
    field :start_minute, non_null(:integer)
    field :event_type, non_null(:quiz_input)
    field :session_template_id, non_null(:string)
  end

  input_object :update_event_input do
    field :id, non_null(:id)
    field :name, :string
    field :start_minute, :integer
    field :event_type, non_null(:quiz_input)
  end
end