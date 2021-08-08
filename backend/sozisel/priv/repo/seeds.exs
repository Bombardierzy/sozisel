# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Sozisel.Repo.insert!(%Sozisel.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
#

alias Sozisel.Repo

alias Sozisel.Model.{Events, Sessions, Users, Participants, EventResults, LaunchedEvents}

Repo.transaction(fn ->
  {:ok, user} =
    Users.create_user(%{
      email: "user@user.com",
      first_name: "user",
      last_name: "user",
      password: "user"
    })

  [template1, template2] =
    [
      %{
        name: "Kryminalistyka",
        estimated_time: 2137,
        is_public: false,
        user_id: user.id
      },
      %{
        name: "Fizyka kwantowa",
        estimated_time: 90,
        is_public: true,
        user_id: user.id
      }
    ]
    |> Enum.map(&Sessions.create_template(&1))
    |> Enum.map(&elem(&1, 1))

  _agenda1 =
    [
      %{
        name: "Bestia z wadowic",
        start_minute: 5
      },
      %{
        name: "Szczeble kariery",
        start_minute: 15
      },
      %{
        name: "Karol",
        start_minute: 30
      }
    ]
    |> Enum.map(&Map.put(&1, :session_template_id, template1.id))
    |> Enum.map(&Sessions.create_agenda_entry(&1))
    |> Enum.map(&elem(&1, 1))

  _agenda2 =
    [
      %{
        name: "E = mc^2",
        start_minute: 0
      },
      %{
        name: "Kwantyfikacja światła",
        start_minute: 15
      },
      %{
        name: "Kot Schroedingera",
        start_minute: 45
      }
    ]
    |> Enum.map(&Map.put(&1, :session_template_id, template2.id))
    |> Enum.map(&Sessions.create_agenda_entry(&1))
    |> Enum.map(&elem(&1, 1))

  {:ok, event1} =
    %{
      session_template_id: template1.id,
      name: "Znani przestępcy",
      duration_time_sec: 300,
      start_minute: 20,
      event_data: %{
        target_percentage_of_participants: 100,
        quiz_questions: [
          %{
            id: "fD875==",
            question: "Czy przestępcy lubią gumę turbo?",
            answers: [%{id: "gasdh==", text: "tak"}, %{id: "faaaa==", text: "nie wiem"}],
            correct_answers: [%{id: "faaaa==", text: "nie wiem"}]
          }
        ]
      }
    }
    |> Events.create_event()

  {:ok, event2} =
    %{
      session_template_id: template1.id,
      name: "Ludzie",
      duration_time_sec: 300,
      start_minute: 20,
      event_data: %{
        target_percentage_of_participants: 100,
        quiz_questions: [
          %{
            id: "1",
            question: "Czy jesteś człowiekiem?",
            answers: [%{id: "1", text: "tak"}, %{id: "2", text: "nie"}],
            correct_answers: [%{id: "1", text: "tak"}]
          }
        ]
      }
    }
    |> Events.create_event()

  {:ok, _session1} =
    %{
      name: "Kryminialistyka - 2021",
      scheduled_start_time: DateTime.utc_now() |> DateTime.add(30 * 24 * 3600),
      session_template_id: template1.id,
      user_id: user.id,
      use_jitsi: true,
      entry_password: "password"
    }
    |> Sessions.create_session()

  {:ok, session2} =
    %{
      name: "Nauka o kryminalistach - 2021",
      scheduled_start_time: DateTime.utc_now() |> DateTime.add(15 * 24 * 3600),
      session_template_id: template1.id,
      user_id: user.id,
      use_jitsi: true,
      entry_password: "password",
      start_time: DateTime.utc_now() |> DateTime.add(16 * 24 * 3600),
      end_time: DateTime.utc_now() |> DateTime.add(16 * 24 * 3600 + 3600)
    }
    |> Sessions.create_session()

  {:ok, participant1} =
    Participants.create_participant(%{
      email: "student@gmail.com",
      full_name: "Pan Student Romek",
      session_id: session2.id
    })

  {:ok, participant2} =
    Participants.create_participant(%{
      email: "visitor@gmail.com",
      full_name: "Paweł Odwiedzacz",
      session_id: session2.id
    })

  {:ok, launched_event1} =
    LaunchedEvents.create_launched_event(%{session_id: session2.id, event_id: event1.id})

  {:ok, launched_event2} =
    LaunchedEvents.create_launched_event(%{session_id: session2.id, event_id: event2.id})

  {:ok, _result1} =
    EventResults.create_event_result(%{
      participant_id: participant1.id,
      launched_event_id: launched_event1.id,
      result_data: %{
        participant_answers: [
          %{
            question_id: "fD875==",
            final_answer_ids: ["gasdh=="],
            points: 0,
            answer_time: 10,
            track_nodes: []
          }
        ]
      }
    })

  {:ok, _result2} =
    EventResults.create_event_result(%{
      participant_id: participant2.id,
      launched_event_id: launched_event1.id,
      result_data: %{
        participant_answers: [
          %{
            question_id: "fD875==",
            final_answer_ids: ["gasdh=="],
            points: 1,
            answer_time: 9,
            track_nodes: []
          }
        ]
      }
    })

  {:ok, _result3} =
    EventResults.create_event_result(%{
      participant_id: participant2.id,
      launched_event_id: launched_event2.id,
      result_data: %{
        participant_answers: [
          %{
            question_id: "1",
            final_answer_ids: ["1"],
            points: 1,
            answer_time: 5,
            track_nodes: []
          }
        ]
      }
    })
end)
