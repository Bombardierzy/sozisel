defmodule Sozisel.Factory do
  # use ExMachina.Ecto, repo: Sozisel.Repo
  use Sozisel.ExMachina.PolymorphicEcto, repo: Sozisel.Repo

  alias Sozisel.Model.{Users, Sessions, Events, Quizzes}
  alias Users.User
  alias Sessions.{Template, AgendaEntry, Session}
  alias Events.Event
  alias Quizzes.{Quiz, QuizQuestion}

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
      is_abstract: attrs[:is_abstract] || sequence(:is_abstract, [false, true]),
      is_public: attrs[:is_public] || sequence(:is_public, [false, true]),
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
      start_time: attrs[:start_time] || "2011-05-18T15:01:01.000000Z",
      use_jitsi: attrs[:use_jitsi] || sequence(:use_jitsi, [false, true]),
      name: attrs[:name] || sequence(:name, &"Session name no. #{&1}"),
      user_id: attrs[:user_id] || insert(:user).id,
      session_template_id: attrs[:session_template_id] || insert(:template).id
    }
  end

  def event_factory(attrs) do
    %Event{
      name: attrs[:name] || sequence(:name, &"Event name no. #{&1}"),
      start_minute: attrs[:start_minute] || sequence(:start_minute, [5, 10, 15, 20, 25, 33]),
      event_type:
        attrs[:event_type] ||
          %Quiz{
            duration_time: 52,
            number_of_targets: 21,
            quiz_questions: [
              %QuizQuestion{
                question: "Is this question?",
                answers: ["First answer", "Second answer"],
                correct_answers: [1]
              },
              %QuizQuestion{
                question: "Is this second question?",
                answers: ["Correct answer", "Also correct answer", "Wrong answer"],
                correct_answers: [0,1]
              }
            ]
          },
      session_template_id: attrs[:session_template_id] || insert(:template).id
    }
  end
end
