defmodule SoziselWeb.Schema.Types.QuizTypes do
  use SoziselWeb.Schema.Notation

  object :quiz do
    field :duration_time_sec, non_null(:integer)
    field :target_percentage_of_participants, non_null(:integer)
    field :tracking_mode, non_null(:boolean)
    field :quiz_questions, strong_list_of(:quiz_question)
  end

  object :quiz_question do
    field :question, non_null(:string)
    field :id, non_null(:string)
    field :answers, strong_list_of(:answer)
    field :correct_answers, strong_list_of(:answer)
  end

  object :answer do
    field :text, non_null(:string)
    field :id, non_null(:string)
  end

  input_object :quiz_input do
    field :duration_time_sec, non_null(:integer)
    field :target_percentage_of_participants, non_null(:integer)
    field :tracking_mode, non_null(:boolean)
    field :quiz_questions, strong_list_of(:quiz_question_input)
  end

  input_object :quiz_question_input do
    field :question, non_null(:string)
    field :id, non_null(:string)
    field :answers, strong_list_of(:answer_input)
    field :correct_answers, strong_list_of(:answer_input)
  end

  input_object :answer_input do
    field :text, non_null(:string)
    field :id, non_null(:string)
  end

  input_object :create_quiz_input do
    field :name, non_null(:string)
    field :start_minute, non_null(:integer)
    field :event_data, non_null(:quiz_input)
    field :session_template_id, non_null(:string)
  end

  input_object :update_quiz_input do
    field :id, non_null(:id)
    field :name, :string
    field :start_minute, :integer
    field :event_data, non_null(:quiz_input)
  end
end
