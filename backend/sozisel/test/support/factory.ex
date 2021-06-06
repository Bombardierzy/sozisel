defmodule Sozisel.Factory do
  use Sozisel.ExMachina.PolymorphicEcto, repo: Sozisel.Repo

  alias Sozisel.Model.{Users, Sessions, Events, EventResults, Quizzes, Participants, LaunchedEvents}
  alias Users.User
  alias EventResults.EventResult
  alias Sessions.{Template, AgendaEntry, Session}
  alias LaunchedEvents.LaunchedEvent
  alias Participants.Participant
  alias Events.Event
  alias Quizzes.{Answer, Quiz, QuizQuestion, QuizResult, ParticipantAnswer}

  def user_factory(attrs) do
    %User{
      email: attrs[:email] || sequence(:email, &"email-#{&1}@example.com"),
      first_name: attrs[:first_name] || sequence(:first_name, &"Michael no. #{&1}"),
      last_name: attrs[:last_name] || sequence(:last_name, &"Jordan no. #{&1}"),
      password_hash: attrs[:password_hash] || Bcrypt.hash_pwd_salt(attrs[:password] || "password")
    }
  end

  def template_factory(attrs) do
    %Template{
      deleted_at: attrs[:deleted_at] || nil,
      estimated_time: attrs[:estimated_time] || sequence(:estimated_time, & &1),
      is_public: Map.get(attrs, :is_public, sequence(:is_public, [false, true])),
      name: attrs[:name] || sequence(:name, &"Template name no. #{&1}"),
      user_id: attrs[:user_id] || insert(:user).id
    }
  end

  def agenda_entry_factory(attrs) do
    %AgendaEntry{
      start_minute: attrs[:start_minute] || sequence(:start_minute, & &1),
      name: attrs[:name] || sequence(:name, &"Agenda entry name no. #{&1}"),
      session_template_id: attrs[:session_template_id] || insert(:template).id
    }
  end

  def session_factory(attrs) do
    %Session{
      entry_password: attrs[:entry_password] || sequence(:entry_password, &"some_password-#{&1}"),
      use_jitsi: Map.get(attrs, :use_jitsi, sequence(:use_jitsi, [false, true])),
      name: attrs[:name] || sequence(:name, &"Session name no. #{&1}"),
      user_id: attrs[:user_id] || insert(:user).id,
      session_template_id: attrs[:session_template_id] || insert(:template).id,
      scheduled_start_time: attrs[:scheduled_start_time] || "2011-05-18T15:01:01.000000Z",
      start_time: attrs[:start_time],
      end_time: attrs[:end_time]
    }
  end

  def event_factory(attrs) do
    %Event{
      name: attrs[:event_name] || sequence(:event_name, &"some-event-#{&1}"),
      session_template_id: attrs[:session_template_id],
      start_minute: attrs[:start_minute] || 2137,
      event_data: build(:event_data, type: attrs[:type] || :quiz)
    }
  end

  def event_result_factory(%{participant: participant, launched_event: launched_event, result_data: result_data})  do
    %EventResult{
      participant_id: participant.id,
      launched_event_id: launched_event.id,
      result_data: result_data
    }
  end

  def event_data_factory(attrs) do
    case attrs[:type] do
      :quiz ->
        %Quiz{
          duration_time_sec: 120,
          target_percentage_of_participants: 100,
          tracking_mode: false,
          quiz_questions: [
            %QuizQuestion{
              question: "A czy papież lubi gumę turbo?",
              answers: [
                %Answer{text: "tak", id: "1"},
                %Answer{text: "jeszcze jak", id: "2"},
                %Answer{text: "dziewczynki w warkoczykach", id: "3"}
              ],
              correct_answers: [
                %Answer{text: "dziewczynki w warkoczykach", id: "3"}
              ]
            }
          ]
        }
    end
  end

  def random_event_result(%Quiz{} = quiz) do
    answers =
      quiz.quiz_questions
      |> Enum.map(fn %QuizQuestion{id: id, answers: answers} ->
        %ParticipantAnswer{
          question_id: id,
          final_answer_ids: answers |> Enum.take_random(:rand.uniform(length(answers))) |> Enum.map(& &1.id),
          is_correct: false,
          track_nodes: []
        }
      end)

    %QuizResult{participant_answers: answers}
  end

  def launched_event_factory(attrs) do
    %LaunchedEvent{
      session_id: attrs[:session_id],
      event_id: attrs[:event_id]
    }
  end

  def participant_factory(attrs) do
    %Participant{
      email: attrs[:email] || sequence(:email, &"email-#{&1}@example.com"),
      full_name: attrs[:full_name] || sequence(:full_name, &"Michael Smith no. #{&1}"),
      token: attrs[:token] || :crypto.hash(:md5, sequence(:token, &"token #{&1}")) |> Base.encode16(),
      session_id: attrs[:session_id] || insert(:session).id
    }
  end
end
