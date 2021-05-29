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

alias Sozisel.Model.{Events, Sessions, Users}

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

  agenda1 =
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

  agenda2 =
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
      start_minute: 20,
      event_data: %{
        duration_time_sec: 300,
        target_percentage_of_participants: 100,
        tracking_mode: false,
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

  {:ok, session1} =
    %{
      name: "Kryminialistyka - 2021",
      scheduled_start_time: DateTime.utc_now() |> DateTime.add(30 * 24 * 3600),
      session_template_id: template1.id,
      user_id: user.id,
      use_jitsi: true,
      entry_password: "password"
    }
    |> Sessions.create_session()
end)
