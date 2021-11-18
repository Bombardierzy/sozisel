defmodule Sozisel.Events.Quizzes.QuizSummaryTest do
  use Sozisel.DataCase

  import Sozisel.Factory

  alias Sozisel.Model.Quizzes.{
    Quiz,
    QuizQuestion,
    Answer,
    QuizResult,
    ParticipantAnswer,
    TrackNode
  }

  describe "quiz summary" do
    @valid_attrs_for_event %{
      name: "some name",
      duration_time_sec: 120,
      start_minute: 42,
      event_data: %Quiz{
        target_percentage_of_participants: 2,
        quiz_questions: [
          %QuizQuestion{
            question: "What is the capital of Poland?",
            id: "1",
            answers: [
              %Answer{text: "Cracow", id: "1"},
              %Answer{text: "Warsaw", id: "2"},
              %Answer{text: "Podlasie", id: "3"}
            ],
            correct_answers: [
              %Answer{text: "Warsaw", id: "2"}
            ]
          },
          %QuizQuestion{
            question: "First question?",
            id: "2",
            answers: [
              %Answer{text: "Answer 1", id: "1"},
              %Answer{text: "Answer 2", id: "2"}
            ],
            correct_answers: [
              %Answer{text: "Answer 1", id: "1"}
            ]
          },
          %QuizQuestion{
            question: "How many times did the presenter whistle during the session?",
            id: "3",
            answers: [
              %Answer{text: "32", id: "1"},
              %Answer{text: "31", id: "2"},
              %Answer{text: "33", id: "3"}
            ],
            correct_answers: [
              %Answer{text: "33", id: "3"}
            ]
          }
        ]
      }
    }
    @valid_attrs_for_first_participant %QuizResult{
      participant_answers: [
        %ParticipantAnswer{
          question_id: "1",
          final_answer_ids: ["3"],
          answer_time: 9.42,
          points: 0,
          track_nodes: [
            %TrackNode{reaction_time: 3.32, answer_id: "2", selected: true},
            %TrackNode{reaction_time: 5.41, answer_id: "1", selected: true},
            %TrackNode{reaction_time: 7.25, answer_id: "3", selected: true}
          ]
        },
        %ParticipantAnswer{
          question_id: "3",
          final_answer_ids: ["2"],
          answer_time: 17.23,
          points: 1,
          track_nodes: [
            %TrackNode{reaction_time: 2.53, answer_id: "3", selected: true},
            %TrackNode{reaction_time: 10.52, answer_id: "3", selected: false},
            %TrackNode{reaction_time: 15.74, answer_id: "2", selected: true}
          ]
        }
      ]
    }
    @valid_attrs_for_second_participant %QuizResult{
      participant_answers: [
        %ParticipantAnswer{
          question_id: "1",
          final_answer_ids: ["2"],
          answer_time: 5.63,
          points: 1,
          track_nodes: [
            %TrackNode{reaction_time: 3.33, answer_id: "2", selected: true}
          ]
        },
        %ParticipantAnswer{
          question_id: "2",
          final_answer_ids: [],
          answer_time: 2.42,
          points: 0,
          track_nodes: []
        }
      ]
    }
    @valid_attrs_for_third_participant %QuizResult{
      participant_answers: [
        %ParticipantAnswer{
          question_id: "1",
          final_answer_ids: ["2", "1", "3"],
          answer_time: 2.53,
          points: 0,
          track_nodes: [
            %TrackNode{reaction_time: 0.42, answer_id: "2", selected: true},
            %TrackNode{reaction_time: 1.25, answer_id: "1", selected: true},
            %TrackNode{reaction_time: 1.78, answer_id: "3", selected: true}
          ]
        },
        %ParticipantAnswer{
          question_id: "2",
          final_answer_ids: [],
          answer_time: 2.26,
          points: 0,
          track_nodes: []
        },
        %ParticipantAnswer{
          question_id: "3",
          final_answer_ids: ["1", "3"],
          answer_time: 5.3,
          points: 0,
          track_nodes: [
            %TrackNode{reaction_time: 1.63, answer_id: "3", selected: true},
            %TrackNode{reaction_time: 3.26, answer_id: "1", selected: true}
          ]
        }
      ]
    }
    @valid_attrs_for_fourth_participant %QuizResult{
      participant_answers: []
    }

    setup do
      template = insert(:template)

      valid_attrs = Map.put(@valid_attrs_for_event, :session_template_id, template.id)

      session = insert(:session, session_template_id: template.id)
      quiz = insert(:quiz_event, valid_attrs)
      launched_event = insert(:launched_event, session_id: session.id, event_id: quiz.id)

      p1 = insert(:participant, session_id: session.id)
      p2 = insert(:participant, session_id: session.id)
      p3 = insert(:participant, session_id: session.id)
      p4 = insert(:participant, session_id: session.id)

      insert(:event_result,
        launched_event: launched_event,
        participant: p1,
        result_data: @valid_attrs_for_first_participant
      )

      insert(:event_result,
        launched_event: launched_event,
        participant: p2,
        result_data: @valid_attrs_for_second_participant
      )

      insert(:event_result,
        launched_event: launched_event,
        participant: p3,
        result_data: @valid_attrs_for_third_participant
      )

      insert(:event_result,
        launched_event: launched_event,
        participant: p4,
        result_data: @valid_attrs_for_fourth_participant
      )

      [launched_event: launched_event, p1: p1, p2: p2, p3: p3, p4: p4]
    end

    test "return valid quiz summary", ctx do
      assert %{
               average_points: 0.5,
               average_quiz_answer_time: 11.2,
               number_of_participants: 4
             } = QuizResult.quiz_summary(ctx.launched_event)
    end

    test "return valid quiz participants summary", ctx do
      p1_email = ctx.p1.email
      p2_email = ctx.p2.email
      p3_email = ctx.p3.email
      p4_email = ctx.p4.email

      p1_full_name = ctx.p1.full_name
      p2_full_name = ctx.p2.full_name
      p3_full_name = ctx.p3.full_name
      p4_full_name = ctx.p4.full_name

      assert [
               %{
                 email: ^p1_email,
                 full_name: ^p1_full_name,
                 number_of_points: 1.0,
                 participant_answers: [
                   %Sozisel.Model.Quizzes.ParticipantAnswer{
                     answer_time: 9.42,
                     final_answer_ids: ["3"],
                     points: 0.0,
                     question_id: "1",
                     track_nodes: [
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "2",
                         reaction_time: 3.32,
                         selected: true
                       },
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "1",
                         reaction_time: 5.41,
                         selected: true
                       },
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "3",
                         reaction_time: 7.25,
                         selected: true
                       }
                     ]
                   },
                   %Sozisel.Model.Quizzes.ParticipantAnswer{
                     answer_time: 17.23,
                     final_answer_ids: ["2"],
                     points: 1.0,
                     question_id: "3",
                     track_nodes: [
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "3",
                         reaction_time: 2.53,
                         selected: true
                       },
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "3",
                         reaction_time: 10.52,
                         selected: false
                       },
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "2",
                         reaction_time: 15.74,
                         selected: true
                       }
                     ]
                   }
                 ],
                 quiz_answer_time: 26.65
               },
               %{
                 email: ^p2_email,
                 full_name: ^p2_full_name,
                 number_of_points: 1.0,
                 participant_answers: [
                   %Sozisel.Model.Quizzes.ParticipantAnswer{
                     answer_time: 5.63,
                     final_answer_ids: ["2"],
                     points: 1.0,
                     question_id: "1",
                     track_nodes: [
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "2",
                         reaction_time: 3.33,
                         selected: true
                       }
                     ]
                   },
                   %Sozisel.Model.Quizzes.ParticipantAnswer{
                     answer_time: 2.42,
                     final_answer_ids: [],
                     points: 0.0,
                     question_id: "2",
                     track_nodes: []
                   }
                 ],
                 quiz_answer_time: 8.05
               },
               %{
                 email: ^p3_email,
                 full_name: ^p3_full_name,
                 number_of_points: 0.0,
                 participant_answers: [
                   %Sozisel.Model.Quizzes.ParticipantAnswer{
                     answer_time: 2.53,
                     final_answer_ids: ["2", "1", "3"],
                     points: 0.0,
                     question_id: "1",
                     track_nodes: [
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "2",
                         reaction_time: 0.42,
                         selected: true
                       },
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "1",
                         reaction_time: 1.25,
                         selected: true
                       },
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "3",
                         reaction_time: 1.78,
                         selected: true
                       }
                     ]
                   },
                   %Sozisel.Model.Quizzes.ParticipantAnswer{
                     answer_time: 2.26,
                     final_answer_ids: [],
                     points: 0.0,
                     question_id: "2",
                     track_nodes: []
                   },
                   %Sozisel.Model.Quizzes.ParticipantAnswer{
                     answer_time: 5.3,
                     final_answer_ids: ["1", "3"],
                     points: 0.0,
                     question_id: "3",
                     track_nodes: [
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "3",
                         reaction_time: 1.63,
                         selected: true
                       },
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "1",
                         reaction_time: 3.26,
                         selected: true
                       }
                     ]
                   }
                 ],
                 quiz_answer_time: 10.09
               },
               %{
                 email: ^p4_email,
                 full_name: ^p4_full_name,
                 number_of_points: 0.0,
                 participant_answers: [],
                 quiz_answer_time: 0.0
               }
             ] = QuizResult.quiz_participants_summary(ctx.launched_event)
    end

    test "return valid quiz questions summary", ctx do
      p1_email = ctx.p1.email
      p2_email = ctx.p2.email
      p3_email = ctx.p3.email
      p4_email = ctx.p4.email

      p1_full_name = ctx.p1.full_name
      p2_full_name = ctx.p2.full_name
      p3_full_name = ctx.p3.full_name
      p4_full_name = ctx.p4.full_name

      assert [
               %{
                 answers: [
                   %Sozisel.Model.Quizzes.Answer{id: "1", text: "Cracow"},
                   %Sozisel.Model.Quizzes.Answer{id: "2", text: "Warsaw"},
                   %Sozisel.Model.Quizzes.Answer{id: "3", text: "Podlasie"}
                 ],
                 average_answer_time: 4.4,
                 average_point: 0.25,
                 correct_answers: [
                   %Sozisel.Model.Quizzes.Answer{id: "2", text: "Warsaw"}
                 ],
                 participants_answers: [
                   %{
                     answer_time: 9.42,
                     email: ^p1_email,
                     final_answer_ids: ["3"],
                     full_name: ^p1_full_name,
                     points: 0.0,
                     track_nodes: [
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "2",
                         reaction_time: 3.32,
                         selected: true
                       },
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "1",
                         reaction_time: 5.41,
                         selected: true
                       },
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "3",
                         reaction_time: 7.25,
                         selected: true
                       }
                     ]
                   },
                   %{
                     answer_time: 5.63,
                     email: ^p2_email,
                     final_answer_ids: ["2"],
                     full_name: ^p2_full_name,
                     points: 1.0,
                     track_nodes: [
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "2",
                         reaction_time: 3.33,
                         selected: true
                       }
                     ]
                   },
                   %{
                     answer_time: 2.53,
                     email: ^p3_email,
                     final_answer_ids: ["2", "1", "3"],
                     full_name: ^p3_full_name,
                     points: 0.0,
                     track_nodes: [
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "2",
                         reaction_time: 0.42,
                         selected: true
                       },
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "1",
                         reaction_time: 1.25,
                         selected: true
                       },
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "3",
                         reaction_time: 1.78,
                         selected: true
                       }
                     ]
                   },
                   %{
                     answer_time: 0.0,
                     email: ^p4_email,
                     final_answer_ids: [],
                     full_name: ^p4_full_name,
                     points: 0.0,
                     track_nodes: []
                   }
                 ],
                 question: "What is the capital of Poland?",
                 question_id: "1"
               },
               %{
                 answers: [
                   %Sozisel.Model.Quizzes.Answer{id: "1", text: "Answer 1"},
                   %Sozisel.Model.Quizzes.Answer{id: "2", text: "Answer 2"}
                 ],
                 average_answer_time: 1.17,
                 average_point: 0.0,
                 correct_answers: [
                   %Sozisel.Model.Quizzes.Answer{id: "1", text: "Answer 1"}
                 ],
                 participants_answers: [
                   %{
                     answer_time: 0.0,
                     email: ^p1_email,
                     final_answer_ids: [],
                     full_name: ^p1_full_name,
                     points: 0.0,
                     track_nodes: []
                   },
                   %{
                     answer_time: 2.42,
                     email: ^p2_email,
                     final_answer_ids: [],
                     full_name: ^p2_full_name,
                     points: 0.0,
                     track_nodes: []
                   },
                   %{
                     answer_time: 2.26,
                     email: ^p3_email,
                     final_answer_ids: [],
                     full_name: ^p3_full_name,
                     points: 0.0,
                     track_nodes: []
                   },
                   %{
                     answer_time: 0.0,
                     email: ^p4_email,
                     final_answer_ids: [],
                     full_name: ^p4_full_name,
                     points: 0.0,
                     track_nodes: []
                   }
                 ],
                 question: "First question?",
                 question_id: "2"
               },
               %{
                 answers: [
                   %Sozisel.Model.Quizzes.Answer{id: "1", text: "32"},
                   %Sozisel.Model.Quizzes.Answer{id: "2", text: "31"},
                   %Sozisel.Model.Quizzes.Answer{id: "3", text: "33"}
                 ],
                 average_answer_time: 5.63,
                 average_point: 0.25,
                 correct_answers: [
                   %Sozisel.Model.Quizzes.Answer{id: "3", text: "33"}
                 ],
                 participants_answers: [
                   %{
                     answer_time: 17.23,
                     email: ^p1_email,
                     final_answer_ids: ["2"],
                     full_name: ^p1_full_name,
                     points: 1.0,
                     track_nodes: [
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "3",
                         reaction_time: 2.53,
                         selected: true
                       },
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "3",
                         reaction_time: 10.52,
                         selected: false
                       },
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "2",
                         reaction_time: 15.74,
                         selected: true
                       }
                     ]
                   },
                   %{
                     answer_time: 0.0,
                     email: ^p2_email,
                     final_answer_ids: [],
                     full_name: ^p2_full_name,
                     points: 0.0,
                     track_nodes: []
                   },
                   %{
                     answer_time: 5.3,
                     email: ^p3_email,
                     final_answer_ids: ["1", "3"],
                     full_name: ^p3_full_name,
                     points: 0.0,
                     track_nodes: [
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "3",
                         reaction_time: 1.63,
                         selected: true
                       },
                       %Sozisel.Model.Quizzes.TrackNode{
                         answer_id: "1",
                         reaction_time: 3.26,
                         selected: true
                       }
                     ]
                   },
                   %{
                     answer_time: 0.0,
                     email: ^p4_email,
                     final_answer_ids: [],
                     full_name: ^p4_full_name,
                     points: 0.0,
                     track_nodes: []
                   }
                 ],
                 question: "How many times did the presenter whistle during the session?",
                 question_id: "3"
               }
             ] = QuizResult.quiz_questions_summary(ctx.launched_event)
    end
  end
end
