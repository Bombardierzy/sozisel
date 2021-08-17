defmodule SoziselWeb.Schema.Types.QuizTypes do
  use SoziselWeb.Schema.Notation

  object :quiz do
    field :duration_time_sec, non_null(:integer)
    field :target_percentage_of_participants, non_null(:integer)
    field :quiz_questions, strong_list_of(:quiz_question)
  end

  object :quiz_question do
    field :question, non_null(:string)
    field :id, non_null(:id)
    field :answers, strong_list_of(:answer)
    field :correct_answers, strong_list_of(:answer)
  end

  object :answer do
    field :text, non_null(:string)
    field :id, non_null(:id)
  end

  object :quiz_result do
    field :participant_answers, strong_list_of(:participant_quiz_answer)
  end

  object :quiz_simple_result do
    field :total_points, non_null(:float)
  end

  object :participant_quiz_answer do
    field :question_id, non_null(:string)
    field :final_answer_ids, strong_list_of(:string)
    field :answer_time, non_null(:float)
    field :points, non_null(:float)
    field :track_nodes, strong_list_of(:quiz_answer_track_node)
  end

  object :quiz_answer_track_node do
    field :reaction_time, non_null(:float)
    field :answer_id, non_null(:string)
    field :selected, non_null(:boolean)
  end

  # ==== PARTICIPANT QUIZ ======

  object :participant_quiz do
    field :quiz_questions, strong_list_of(:participant_quiz_question)
  end

  # we create a proxy type for quiz question so the participant won't be able to
  # look up the answers in network tab in the browser
  object :participant_quiz_question do
    field :id, non_null(:id)
    field :question, non_null(:string)
    field :answers, strong_list_of(:answer)
  end

  # ============================

  input_object :quiz_input do
    field :target_percentage_of_participants, non_null(:integer)
    field :quiz_questions, strong_list_of(:quiz_question_input)
  end

  input_object :quiz_question_input do
    field :id, non_null(:id)
    field :question, non_null(:string)
    field :answers, strong_list_of(:answer_input)
    field :correct_answers, strong_list_of(:answer_input)
  end

  input_object :answer_input do
    field :text, non_null(:string)
    field :id, non_null(:id)
  end

  input_object :create_quiz_input do
    import_fields :create_event_input_base

    field :event_data, non_null(:quiz_input)
  end

  input_object :update_quiz_input do
    import_fields :update_event_input_base

    field :event_data, non_null(:quiz_input)
  end

  input_object :quiz_result_input do
    field :launched_event_id, non_null(:string)
    field :participant_answers, strong_list_of(:participant_quiz_answer_input)
  end

  input_object :participant_quiz_answer_input do
    field :question_id, non_null(:string)
    field :final_answer_ids, strong_list_of(:string)
    field :answer_time, non_null(:float)
    field :track_nodes, list_of(:quiz_answer_track_node_input)
  end

  input_object :quiz_answer_track_node_input do
    field :reaction_time, non_null(:float)
    field :answer_id, non_null(:string)
    field :selected, non_null(:boolean)
  end

  # ==== QUIZ SUMMARY ======

  object :quiz_summary do
    field :number_of_participants, non_null(:integer)
    field :average_points, non_null(:float)
    field :average_quiz_answer_time, non_null(:float)
  end

  object :quiz_participant_summary do
    field :full_name, non_null(:string)
    field :email, non_null(:string)
    field :number_of_points, non_null(:float)
    field :quiz_answer_time, non_null(:float)
    field :participant_answers, strong_list_of(:participant_quiz_answer)
  end

  object :quiz_question_summary do
    field :question, non_null(:string)
    field :question_id, non_null(:string)
    field :answers, strong_list_of(:answer)
    field :correct_answers, strong_list_of(:answer)
    field :average_point, non_null(:float)
    field :average_answer_time, non_null(:float)
    field :participants_answers, strong_list_of(:participant_answer)
  end

  object :participant_answer do
    field :full_name, non_null(:string)
    field :email, non_null(:string)
    field :points, non_null(:float)
    field :answer_time, non_null(:float)
    field :final_answer_ids, strong_list_of(:string)
    field :track_nodes, strong_list_of(:quiz_answer_track_node)
  end
end
