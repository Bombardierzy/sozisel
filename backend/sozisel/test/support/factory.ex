defmodule Sozisel.Factory do
  use Sozisel.ExMachina.PolymorphicEcto, repo: Sozisel.Repo

  alias Sozisel.Model.{
    Users,
    Sessions,
    Events,
    EventResults,
    Quizzes,
    Polls,
    Whiteboards,
    Participants,
    LaunchedEvents,
    SessionResources,
    SessionResourceLinks
  }

  alias Users.User
  alias EventResults.EventResult
  alias Sessions.{Template, AgendaEntry, Session}
  alias LaunchedEvents.LaunchedEvent
  alias Participants.Participant
  alias Polls.{Poll, PollResult, PollOption}
  alias Events.Event
  alias Quizzes.{Answer, Quiz, QuizQuestion, QuizResult, ParticipantAnswer}
  alias Whiteboards.{Whiteboard, WhiteboardResult}
  alias SessionResources.SessionResource
  alias SessionResourceLinks.SessionResourceLink

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

  def quiz_event_factory(attrs) do
    event_data =
      case attrs[:event_data] do
        nil -> build(:quiz_event_data)
        %Quiz{} = quiz -> quiz
      end

    %Event{
      name: attrs[:event_name] || sequence(:event_name, &"some-quiz-event-#{&1}"),
      session_template_id: attrs[:session_template_id],
      duration_time_sec: attrs[:duration_time_sec] || 120,
      start_minute: attrs[:start_minute] || 2137,
      event_data: event_data
    }
  end

  def poll_event_factory(attrs) do
    event_data =
      case attrs[:event_data] do
        nil -> build(:poll_event_data)
        %Poll{} = poll -> poll
      end

    %Event{
      name: attrs[:event_name] || sequence(:event_name, &"some-poll-event-#{&1}"),
      session_template_id: attrs[:session_template_id],
      duration_time_sec: attrs[:duration_time_sec] || 120,
      start_minute: attrs[:start_minute] || 2137,
      event_data: event_data
    }
  end

  def whiteboard_event_factory(attrs) do
    event_data =
      case attrs[:event_data] do
        nil -> build(:whiteboard_event_data)
        %Whiteboard{} = whiteboard -> whiteboard
      end

    %Event{
      name: attrs[:event_name] || sequence(:event_name, &"some-whiteboard-event-#{&1}"),
      session_template_id: attrs[:session_template_id],
      duration_time_sec: attrs[:duration_time_sec] || 120,
      start_minute: attrs[:start_minute] || 2137,
      event_data: event_data
    }
  end

  def random_event_factory(attrs) do
    [:quiz, :poll, :whiteboard]
    |> Enum.random()
    |> case do
      :quiz -> build(:quiz_event, attrs)
      :poll -> build(:poll_event, attrs)
      :whiteboard -> build(:whiteboard_event, attrs)
    end
  end

  def event_result_factory(%{
        participant: participant,
        launched_event: launched_event,
        result_data: result_data
      }) do
    %EventResult{
      participant_id: participant.id,
      launched_event_id: launched_event.id,
      result_data: result_data
    }
  end

  def quiz_event_data_factory(_attrs) do
    %Quiz{
      target_percentage_of_participants: 100,
      quiz_questions: [
        %QuizQuestion{
          id: "1",
          question: "Kto jest twórcą Sozisela?",
          answers: [
            %Answer{text: "Jakub Perżyło", id: "1"},
            %Answer{text: "Przemysław Wątroba", id: "2"},
            %Answer{text: "Jakub Myśliwiec", id: "3"},
            %Answer{text: "Sebastian Kuśnierz", id: "4"},
            %Answer{text: "Flaneczki Team", id: "5"}
          ],
          correct_answers: [
            %Answer{text: "Jakub Perżyło", id: "1"},
            %Answer{text: "Przemysław Wątroba", id: "2"},
            %Answer{text: "Jakub Myśliwiec", id: "3"},
            %Answer{text: "Sebastian Kuśnierz", id: "4"}
          ]
        },
        %QuizQuestion{
          id: "2",
          question: "Całka z x^2?",
          answers: [
            %Answer{text: "1/3 * x^3", id: "1"},
            %Answer{text: "1/3 * x^3 + C", id: "2"},
            %Answer{text: "2x", id: "3"}
          ],
          correct_answers: [
            %Answer{text: "1/3 * x^3 + C", id: "2"}
          ]
        }
      ]
    }
  end

  def poll_event_data_factory(_attrs) do
    %Poll{
      question: "Who do you like?",
      is_multi_choice: false,
      options: [
        %PollOption{id: "1", text: "Everyone"},
        %PollOption{id: "2", text: "No one"}
      ]
    }
  end

  def whiteboard_event_data_factory(_attrs) do
    %Whiteboard{
      task: "Draw a fortuna export"
    }
  end

  def random_event_result(%Quiz{} = quiz) do
    answers =
      quiz.quiz_questions
      |> Enum.map(fn %QuizQuestion{id: id, answers: answers} ->
        %ParticipantAnswer{
          question_id: id,
          final_answer_ids:
            answers |> Enum.take_random(:rand.uniform(length(answers))) |> Enum.map(& &1.id),
          answer_time: 12.4,
          points: 0.53,
          track_nodes: []
        }
      end)

    %QuizResult{participant_answers: answers}
  end

  def random_event_result(%Poll{options: options, is_multi_choice: multi_choice}) do
    option_ids =
      if multi_choice do
        options
        |> Enum.map(& &1.id)
        |> Enum.take_random(:rand.uniform(length(options)))
      else
        options
        |> Enum.random()
        |> then(& &1.id)
        |> List.wrap()
      end

    %PollResult{option_ids: option_ids}
  end

  def random_event_result(%Whiteboard{}) do
    %WhiteboardResult{
      path: "/tmp/test_image.png",
      used_time: 13.21
    }
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
      token:
        attrs[:token] || :crypto.hash(:md5, sequence(:token, &"token #{&1}")) |> Base.encode16(),
      session_id: attrs[:session_id] || insert(:session).id
    }
  end

  def session_resource_factory(attrs) do
    %SessionResource{
      path: attrs[:path] || sequence(:path, &"Path no. #{&1}"),
      filename: attrs[:filename] || sequence(:filename, &"Filename no. #{&1}"),
      user_id: attrs[:user_id] || insert(:user).id
    }
  end

  def session_resource_link_factory(attrs) do
    %SessionResourceLink{
      session_resource_id: attrs[:session_resource_id] || insert(:session_resource).id,
      session_id: attrs[:session_id] || insert(:session).id,
      is_public: Map.get(attrs, :is_public, sequence(:is_public, [false, true]))
    }
  end
end
