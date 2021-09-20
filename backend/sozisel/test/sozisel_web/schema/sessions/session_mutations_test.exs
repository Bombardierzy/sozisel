defmodule SoziselWeb.Schema.Sessions.SessionMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @create_session """
  mutation CreateSession($input: CreateSessionInput!) {
    createSession(input: $input) {
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

  @update_session """
  mutation UpdateSession($input: UpdateSessionInput!) {
    updateSession(input: $input) {
      id
      name
      scheduledStartTime
      useJitsi
      entryPassword
    }
  }
  """

  @delete_session """
  mutation DeleteSession($id: ID!) {
    deleteSession(id: $id) {
      id
    }
  }
  """

  @start_session """
  mutation StartSession($id: ID!) {
    startSession(id: $id) {
      id
      startTime
      endTime
    }
  }
  """

  @end_session """
  mutation EndSession($id: ID!) {
    endSession(id: $id) {
      id
      startTime
      endTime
    }
  }
  """

  describe "Session mutations should" do
    setup do
      user = insert(:user)
      template = insert(:template, user_id: user.id)
      session = insert(:session, user_id: user.id, session_template_id: template.id)

      [conn: test_conn(user), user: user, template: template, session: session]
    end

    test "create a new session", ctx do
      scheduled_start_time = DateTime.utc_now() |> DateTime.to_iso8601()
      session_template_id = ctx.template.id
      owner_id = ctx.user.id

      variables = %{
        input: %{
          name: "session",
          scheduled_start_time: scheduled_start_time,
          use_jitsi: false,
          entry_password: "password",
          session_template_id: session_template_id
        }
      }

      assert %{
               data: %{
                 "createSession" => %{
                   "id" => _,
                   "name" => "session",
                   "scheduledStartTime" => ^scheduled_start_time,
                   "useJitsi" => false,
                   "entryPassword" => "password",
                   "sessionTemplate" => %{
                     "id" => ^session_template_id
                   },
                   "owner" => %{
                     "id" => ^owner_id
                   },
                   "startTime" => nil,
                   "endTime" => nil
                 }
               }
             } = run_query(ctx.conn, @create_session, variables)
    end

    test "update an existing session", ctx do
      new_scheduled_start_time = DateTime.utc_now() |> DateTime.to_iso8601()

      variables = %{
        input: %{
          id: ctx.session.id,
          name: "updated_session",
          scheduled_start_time: new_scheduled_start_time,
          use_jitsi: true,
          entry_password: "new_password"
        }
      }

      assert %{
               data: %{
                 "updateSession" => %{
                   "id" => _,
                   "name" => "updated_session",
                   "scheduledStartTime" => ^new_scheduled_start_time,
                   "useJitsi" => true,
                   "entryPassword" => "new_password"
                 }
               }
             } = run_query(ctx.conn, @update_session, variables)
    end

    test "delete an existing session", ctx do
      session_id = ctx.session.id

      assert %{
               data: %{
                 "deleteSession" => %{
                   "id" => ^session_id
                 }
               }
             } = run_query(ctx.conn, @delete_session, %{id: session_id})
    end

    test "start an existing session", ctx do
      session_id = ctx.session.id

      assert %{
               data: %{
                 "startSession" => %{
                   "id" => ^session_id,
                   "startTime" => start_time
                 }
               }
             } = run_query(ctx.conn, @start_session, %{id: session_id})

      assert {:ok, _, _} = DateTime.from_iso8601(start_time)
    end

    test "end an existing session", ctx do
      session_id = ctx.session.id

      run_query(ctx.conn, @start_session, %{id: session_id})

      assert %{
               data: %{
                 "endSession" => %{
                   "id" => ^session_id,
                   "endTime" => end_time
                 }
               }
             } = run_query(ctx.conn, @end_session, %{id: session_id})

      assert {:ok, _, _} = DateTime.from_iso8601(end_time)
    end
  end
end
