defmodule SoziselWeb.Schema.Sessions.SessionQueriesTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  alias Sozisel.Model.Sessions

  @get_session """
  query GetSession($id: ID!) {
    session(id: $id) {
      id
    }
  }
  """

  @get_session_thumbnail """
  query GetSessionThumbnail($id: ID!) {
    sessionThumbnail(id: $id) {
      id
    }
  }
  """

  @search_sessions """
  query SearchSessions($status: SessionStatus!, $dateFrom: DateTime, $dateTo: DateTime, $name: String, $templateId: ID) {
    searchSessions(input: {status: $status, dateFrom: $dateFrom, dateTo: $dateTo, name: $name, templateId: $templateId}) {
      id
      name
      entryPassword
      scheduledStartTime
      startTime
      endTime
      useJitsi

      owner {
        id
      }

      sessionTemplate {
        id
      }
    }
  }
  """

  describe "Sessions' search query should" do
    setup do
      user = insert(:user)
      [conn: test_conn(user), user: user]
    end

    test "get session by id", ctx do
      session_id = insert(:session, user_id: ctx.user.id).id

      assert %{
               data: %{
                 "session" => %{"id" => ^session_id}
               }
             } = run_query(ctx.conn, @get_session, %{id: session_id})

      assert %{
               data: %{
                 "session" => nil
               }
             } = run_query(ctx.conn, @get_session, %{id: Ecto.UUID.generate()})

      other_conn = test_conn(insert(:user))

      assert %{
               errors: [%{"message" => "unauthorized"}]
             } = run_query(other_conn, @get_session, %{id: session_id})
    end

    test "get session thumbnail by id", ctx do
      session_id = insert(:session).id

      assert %{
               data: %{
                 "sessionThumbnail" => %{"id" => ^session_id}
               }
             } = run_query(ctx.conn, @get_session_thumbnail, %{id: session_id})

      assert %{
               data: %{
                 "sessionThumbnail" => nil
               }
             } = run_query(ctx.conn, @get_session_thumbnail, %{id: Ecto.UUID.generate()})
    end

    test "search by name", ctx do
      session_a = insert(:session, user_id: ctx.user.id, name: "a")
      insert(:session, user_id: ctx.user.id, name: "b")
      session_ab = insert(:session, user_id: ctx.user.id, name: "ab")

      assert %{
               data: %{
                 "searchSessions" => sessions
               }
             } = run_query(ctx.conn, @search_sessions, %{name: "a", status: "ANY"})

      assert sessions_id_set(sessions) == sessions_id_set([session_a, session_ab])

      assert %{
               data: %{
                 "searchSessions" => sessions
               }
             } = run_query(ctx.conn, @search_sessions, %{name: "", status: "ANY"})

      assert length(sessions) == 3
    end

    test "search by dates", ctx do
      date_a = ~U[2021-05-01 12:00:00Z]
      date_b = ~U[2021-05-15 12:00:00Z]
      date_c = ~U[2021-05-31 12:00:00Z]

      session_a = insert(:session, user_id: ctx.user.id, scheduled_start_time: date_a)
      session_b = insert(:session, user_id: ctx.user.id, scheduled_start_time: date_b)
      session_c = insert(:session, user_id: ctx.user.id, scheduled_start_time: date_c)

      # without dates
      assert %{
               data: %{
                 "searchSessions" => sessions
               }
             } = run_query(ctx.conn, @search_sessions, %{status: "ANY"})

      assert length(sessions) == 3

      # date from
      assert %{
               data: %{
                 "searchSessions" => sessions
               }
             } =
               run_query(ctx.conn, @search_sessions, %{
                 dateFrom: DateTime.add(date_b, -3600, :second) |> DateTime.to_iso8601(),
                 status: "ANY"
               })

      assert sessions_id_set(sessions) == sessions_id_set([session_b, session_c])

      # date to
      assert %{
               data: %{
                 "searchSessions" => sessions
               }
             } =
               run_query(ctx.conn, @search_sessions, %{
                 dateTo: DateTime.to_iso8601(~U[2021-05-16 12:00:00Z]),
                 status: "ANY"
               })

      assert sessions_id_set(sessions) == sessions_id_set([session_a, session_b])

      # both date from and date to
      assert %{
               data: %{
                 "searchSessions" => sessions
               }
             } =
               run_query(ctx.conn, @search_sessions, %{
                 dateFrom: DateTime.to_iso8601(~U[2021-05-10 12:00:00Z]),
                 dateTo: DateTime.to_iso8601(~U[2021-05-20 12:00:00Z]),
                 status: "ANY"
               })

      assert sessions_id_set(sessions) == sessions_id_set(session_b)

      # out of time frame
      assert %{
               data: %{
                 "searchSessions" => []
               }
             } =
               run_query(ctx.conn, @search_sessions, %{
                 dateFrom: DateTime.to_iso8601(~U[1986-05-10 12:00:00Z]),
                 dateTo: DateTime.to_iso8601(~U[1986-05-20 12:00:00Z]),
                 status: "ANY"
               })
    end

    test "search by status", ctx do
      scheduled_session =
        insert(:session,
          user_id: ctx.user.id,
          scheduled_start_time: DateTime.utc_now() |> DateTime.add(3600 * 24 * 7, :second)
        )

      in_progress_session = insert(:session, user_id: ctx.user.id)
      ended_session = insert(:session, user_id: ctx.user.id)

      in_progress_session |> Sessions.start_session()
      ended_session |> Sessions.start_session() |> elem(1) |> Sessions.end_session()

      # any status
      assert %{
               data: %{
                 "searchSessions" => sessions
               }
             } = run_query(ctx.conn, @search_sessions, %{status: "ANY"})

      assert length(sessions) == 3

      # scheduled status
      assert %{
               data: %{
                 "searchSessions" => sessions
               }
             } = run_query(ctx.conn, @search_sessions, %{status: "SCHEDULED"})

      assert sessions_id_set(sessions) == sessions_id_set(scheduled_session)

      # in_progress status
      assert %{
               data: %{
                 "searchSessions" => sessions
               }
             } = run_query(ctx.conn, @search_sessions, %{status: "IN_PROGRESS"})

      assert sessions_id_set(sessions) == sessions_id_set(in_progress_session)

      # ended status
      assert %{
               data: %{
                 "searchSessions" => sessions
               }
             } = run_query(ctx.conn, @search_sessions, %{status: "ENDED"})

      assert sessions_id_set(sessions) == sessions_id_set(ended_session)
    end

    test "search by template id", ctx do
      template = insert(:template)

      session =
        insert(:session,
          user_id: ctx.user.id,
          session_template_id: template.id
        )

      insert(:session, user_id: ctx.user.id)

      assert %{
               data: %{
                 "searchSessions" => sessions
               }
             } = run_query(ctx.conn, @search_sessions, %{status: "ANY", templateId: template.id})

      assert length(sessions) == 1
      assert sessions_id_set(sessions) == sessions_id_set(session)
    end

    test "filters combined", ctx do
      template = insert(:template)
      session_a = insert(:session, user_id: ctx.user.id, name: "a")
      insert(:session, user_id: ctx.user.id, name: "b")

      session_ab =
        insert(:session,
          user_id: ctx.user.id,
          name: "ab",
          scheduled_start_time: ~U[2021-05-01 12:00:00Z],
          session_template_id: template.id
        )

      session_bc =
        insert(:session,
          user_id: ctx.user.id,
          name: "bc",
          scheduled_start_time: ~U[2021-05-01 12:00:00Z]
        )

      session_a |> Sessions.start_session()
      session_ab |> Sessions.start_session() |> elem(1) |> Sessions.end_session()

      # in progress and 'a' name
      assert %{
               data: %{
                 "searchSessions" => sessions
               }
             } = run_query(ctx.conn, @search_sessions, %{name: "a", status: "IN_PROGRESS"})

      assert sessions_id_set(sessions) == sessions_id_set(session_a)

      # any and 'a' name
      assert %{
               data: %{
                 "searchSessions" => sessions
               }
             } = run_query(ctx.conn, @search_sessions, %{name: "a", status: "ANY"})

      assert sessions_id_set(sessions) == sessions_id_set([session_a, session_ab])

      # dateFrom, name and status any
      assert %{
               data: %{
                 "searchSessions" => sessions
               }
             } =
               run_query(ctx.conn, @search_sessions, %{
                 dateFrom: ~U[2021-01-01 12:00:00Z] |> DateTime.to_iso8601(),
                 name: "b",
                 status: "ANY"
               })

      assert sessions_id_set(sessions) == sessions_id_set([session_ab, session_bc])

      # dateFrom, name, status ended, template
      assert %{
               data: %{
                 "searchSessions" => sessions
               }
             } =
               run_query(ctx.conn, @search_sessions, %{
                 dateFrom: ~U[2021-01-01 12:00:00Z] |> DateTime.to_iso8601(),
                 name: "b",
                 status: "ENDED",
                 templateId: template.id
               })

      assert sessions_id_set(sessions) == sessions_id_set([session_ab])
    end
  end

  defp sessions_id_set(sessions) do
    sessions
    |> List.wrap()
    |> Enum.map(&(Map.get(&1, "id") || Map.get(&1, :id)))
    |> MapSet.new()
  end
end
