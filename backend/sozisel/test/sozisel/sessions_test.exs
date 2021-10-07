defmodule Sozisel.SessionsTest do
  use Sozisel.DataCase

  alias Sozisel.Model.Sessions
  alias Sozisel.Model.Sessions.Session

  import Sozisel.Factory

  describe "sessions" do
    @valid_attrs %{
      entry_password: "some entry_password",
      name: "some name",
      scheduled_start_time: "2010-04-17T14:00:00.000000Z",
      use_jitsi: true
    }
    @update_attrs %{
      entry_password: "some updated entry_password",
      name: "some updated name",
      scheduled_start_time: "2011-05-18T15:01:01.000000Z",
      use_jitsi: false,
      summary_note: "some summary note"
    }
    @invalid_attrs %{entry_password: nil, name: nil, scheduled_start_time: nil, use_jitsi: nil}

    test "list_sessions/0 returns all sessions" do
      session = insert(:session)
      assert Sessions.list_sessions() == [session]
    end

    test "list_user_sessions/1 returns all user sessions" do
      user = insert(:user)
      session = insert(:session, %{user_id: user.id})
      assert Sessions.list_user_sessions(user.id) == [session]
    end

    test "get_session!/1 returns the session with given id" do
      session = insert(:session)
      assert Sessions.get_session!(session.id) == session
    end

    test "create_session/1 with valid data creates a session" do
      user = insert(:user)
      template = insert(:template)

      valid_attrs =
        Map.put(@valid_attrs, :user_id, user.id) |> Map.put(:session_template_id, template.id)

      assert {:ok, %Session{} = session} = Sessions.create_session(valid_attrs)
      assert session.entry_password == "some entry_password"
      assert session.name == "some name"

      assert session.scheduled_start_time ==
               DateTime.from_naive!(~N[2010-04-17T14:00:00.000000Z], "Etc/UTC")

      assert session.use_jitsi == true
    end

    test "create_session/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Sessions.create_session(@invalid_attrs)
    end

    test "update_session/2 with valid data updates the session" do
      session = insert(:session)
      assert {:ok, %Session{} = session} = Sessions.update_session(session, @update_attrs)
      assert session.entry_password == "some updated entry_password"
      assert session.name == "some updated name"
      assert session.summary_note == "some summary note"

      assert session.scheduled_start_time ==
               DateTime.from_naive!(~N[2011-05-18T15:01:01.000000Z], "Etc/UTC")

      assert session.use_jitsi == false
    end

    test "update_session/2 with invalid data returns error changeset" do
      session = insert(:session)
      assert {:error, %Ecto.Changeset{}} = Sessions.update_session(session, @invalid_attrs)
      assert session == Sessions.get_session!(session.id)
    end

    test "delete_session/1 deletes the session" do
      session = insert(:session)
      assert {:ok, %Session{}} = Sessions.delete_session(session)
      assert_raise Ecto.NoResultsError, fn -> Sessions.get_session!(session.id) end
    end

    test "start_session/1 sets start_time field" do
      session = insert(:session)
      assert is_nil(session.start_time)

      assert {:ok, %Session{start_time: start_time}} = session |> Sessions.start_session()

      refute is_nil(start_time)
    end

    test "end_session/1 sets end_time field" do
      session = insert(:session, start_time: DateTime.utc_now())
      assert is_nil(session.end_time)

      assert {:ok, %Session{end_time: end_time}} = session |> Sessions.end_session()

      refute is_nil(end_time)
    end

    test "setting invalid start/end times returns and error changeset" do
      session = insert(:session)

      assert {:error, _} = session |> Sessions.end_session()

      # setting end_time when start_time is not set
      assert %Ecto.Changeset{valid?: false} =
               session |> Session.update_changeset(%{end_time: DateTime.utc_now()})

      # setting start_time before end_time
      assert %Ecto.Changeset{valid?: false} =
               session
               |> Session.update_changeset(%{
                 start_time: DateTime.utc_now() |> DateTime.add(10, :second),
                 end_time: DateTime.utc_now()
               })
    end

    test "session summary returns a proper structure" do
      template = insert(:template)
      event1 = insert(:quiz_event, session_template_id: template.id)
      event2 = insert(:quiz_event, session_template_id: template.id)

      session = insert(:session, session_template_id: template.id)

      {:ok, session} =
        Sessions.update_session(session, %{
          start_time: DateTime.utc_now(),
          end_time: DateTime.utc_now() |> DateTime.add(3600)
        })

      launched_event1 = insert(:launched_event, session_id: session.id, event_id: event1.id)
      launched_event2 = insert(:launched_event, session_id: session.id, event_id: event2.id)

      participant1 = insert(:participant, session_id: session.id)
      participant2 = insert(:participant, session_id: session.id)

      _event_result1 =
        insert(:event_result,
          launched_event: launched_event1,
          participant: participant1,
          result_data: random_event_result(event1.event_data)
        )

      _event_result2 =
        insert(:event_result,
          launched_event: launched_event1,
          participant: participant2,
          result_data: random_event_result(event1.event_data)
        )

      _event_result3 =
        insert(:event_result,
          launched_event: launched_event2,
          participant: participant2,
          result_data: random_event_result(event2.event_data)
        )

      assert %{
               duration_time: 60,
               total_participants: 2,
               total_submissions: 3,
               event_participations: [
                 %{
                   event_id: event1.id,
                   launched_event_id: launched_event1.id,
                   event_name: event1.name,
                   start_minute: DateTime.diff(event1.inserted_at, session.start_time),
                   event_type: :quiz,
                   submissions: 2
                 },
                 %{
                   event_id: event2.id,
                   launched_event_id: launched_event2.id,
                   event_name: event2.name,
                   start_minute: DateTime.diff(event2.inserted_at, session.start_time),
                   event_type: :quiz,
                   submissions: 1
                 }
               ]
             } == session |> Sessions.session_summary()
    end
  end
end
