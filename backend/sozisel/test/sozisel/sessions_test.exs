defmodule Sozisel.SessionsTest do
  use Sozisel.DataCase

  alias Sozisel.Model.Sessions

  import Sozisel.Factory

  describe "session_templates" do
    alias Sozisel.Model.Sessions.Template

    @valid_attrs %{
      deleted_at: nil,
      estimated_time: 42,
      is_public: false,
      name: "some name"
    }
    @update_attrs %{
      deleted_at: "2011-05-18T15:01:01.000000Z",
      estimated_time: 43,
      is_public: false,
      name: "some updated name"
    }
    @invalid_attrs %{
      deleted_at: nil,
      estimated_time: nil,
      is_public: nil,
      name: nil
    }

    test "list_session_templates/0 returns all session_templates" do
      template = insert(:template)
      assert Sessions.list_session_templates() == [template]
    end

    test "list_session_templates/1 doesn not return deleted session_templates" do
      template = insert(:template)
      assert {:ok, _template} = Sessions.delete_template(template)
      assert Sessions.list_session_templates(deleted: false) == []
    end

    test "list_session_templates/1 returns all user's session_templates" do
      user = insert(:user)
      template = insert(:template, %{user_id: user.id})
      assert Sessions.list_session_templates(user_id: user.id) == [template]
    end

    test "list_session_templates/1 returns all user's session_templates with matching name" do
      user = insert(:user)
      template = insert(:template, %{user_id: user.id, name: "Sozisel"})
      insert(:template, %{user_id: user.id, name: "other_name"})
      assert Sessions.list_session_templates(user_id: user.id, name: "ozis") == [template]
    end

    test "list_session_templates/1 returns all public session_templates" do
      template = insert(:template, %{is_public: true})
      assert Sessions.list_session_templates(is_public: true) == [template]
    end

    test "list_session_templates/1 returns all public session_templates with matching name" do
      template = insert(:template, %{is_public: true, name: "Sozisel"})
      insert(:template, %{is_public: true, name: "other_name"})
      assert Sessions.list_session_templates(is_public: true, name: "ozis") == [template]
    end

    test "get_template!/1 returns the template with given id" do
      template = insert(:template)
      assert Sessions.get_template!(template.id) == template
    end

    test "create_template/1 with valid data creates a template" do
      user = insert(:user)
      valid_attrs = Map.put(@valid_attrs, :user_id, user.id)
      assert {:ok, %Template{} = template} = Sessions.create_template(valid_attrs)
      assert template.deleted_at == nil
      assert template.estimated_time == 42
      assert template.is_public == false
      assert template.name == "some name"
    end

    test "create_template/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Sessions.create_template(@invalid_attrs)
    end

    test "create_template_with_agenda_and_events/1 with valid data creates template with agenda entries" do
      user = insert(:user)

      agenda_entries = [
        %{name: "First point", start_minute: 1},
        %{name: "Second point", start_minute: 2}
      ]

      attrs = Map.merge(@valid_attrs, %{user_id: user.id, agenda_entries: agenda_entries})

      assert {:ok, %Template{} = template} =
               Sessions.create_template_with_agenda_and_events(attrs)

      template = Repo.preload(template, :agenda_entries)

      assert template.agenda_entries |> length == 2
    end

    test "update_template_with_agenda/1 with valid data updates template with agenda entries" do
      user = insert(:user)

      agenda_entries = [
        %{name: "First point", start_minute: 1},
        %{name: "Second point", start_minute: 2}
      ]

      attrs = Map.merge(@valid_attrs, %{user_id: user.id, agenda_entries: agenda_entries})

      entries_count = fn template ->
        Repo.preload(template, :agenda_entries).agenda_entries |> length
      end

      assert {:ok, %Template{} = template} =
               Sessions.create_template_with_agenda_and_events(attrs)

      assert entries_count.(template) == 2

      assert {:ok, %Template{} = template} =
               Sessions.update_template_with_agenda(template, %{name: "updated name"})

      assert template.name == "updated name"

      # update does not change entries
      assert entries_count.(template) == 2

      new_entry = %{name: "New entry", start_minute: 1}

      assert {:ok, %Template{} = template} =
               Sessions.update_template_with_agenda(template, %{agenda_entries: [new_entry]})

      # should replace old entries with a single one
      assert entries_count.(template) == 1
    end

    test "update_template/2 with valid data updates the template" do
      template = insert(:template)
      assert {:ok, %Template{} = template} = Sessions.update_template(template, @update_attrs)

      assert template.deleted_at ==
               DateTime.from_naive!(~N[2011-05-18T15:01:01.000000Z], "Etc/UTC")

      assert template.estimated_time == 43
      assert template.is_public == false
      assert template.name == "some updated name"
    end

    test "update_template/2 with invalid data returns error changeset" do
      template = insert(:template)
      assert {:error, %Ecto.Changeset{}} = Sessions.update_template(template, @invalid_attrs)
      assert template == Sessions.get_template!(template.id)
    end

    test "delete_template/1 soft deletes the template" do
      template = insert(:template)
      assert {:ok, template} = Sessions.delete_template(template)
      assert template.deleted_at != nil
    end
  end

  describe "agenda_entries" do
    alias Sozisel.Model.Sessions.AgendaEntry

    @valid_attrs %{name: "some name", start_minute: 42}
    @update_attrs %{name: "some updated name", start_minute: 43}
    @invalid_attrs %{name: nil, start_minute: nil}

    test "list_agenda_entries/0 returns all agenda_entries" do
      agenda_entry = insert(:agenda_entry)
      assert Sessions.list_agenda_entries() == [agenda_entry]
    end

    test "list_agenda_entries/1 returns all agenda_entries for given session template" do
      template = insert(:template)
      agenda_entry = insert(:agenda_entry, %{session_template_id: template.id})
      assert Sessions.list_agenda_entries(template.id) == [agenda_entry]
    end

    test "get_agenda_entry!/1 returns the agenda_entry with given id" do
      agenda_entry = insert(:agenda_entry)
      assert Sessions.get_agenda_entry!(agenda_entry.id) == agenda_entry
    end

    test "create_agenda_entry/1 with valid data creates a agenda_entry" do
      template = insert(:template)
      valid_attrs = Map.put(@valid_attrs, :session_template_id, template.id)
      assert {:ok, %AgendaEntry{} = agenda_entry} = Sessions.create_agenda_entry(valid_attrs)
      assert agenda_entry.name == "some name"
      assert agenda_entry.start_minute == 42
    end

    test "create_agenda_entry/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Sessions.create_agenda_entry(@invalid_attrs)
    end

    test "update_agenda_entry/2 with valid data updates the agenda_entry" do
      agenda_entry = insert(:agenda_entry)

      assert {:ok, %AgendaEntry{} = agenda_entry} =
               Sessions.update_agenda_entry(agenda_entry, @update_attrs)

      assert agenda_entry.name == "some updated name"
      assert agenda_entry.start_minute == 43
    end

    test "update_agenda_entry/2 with invalid data returns error changeset" do
      agenda_entry = insert(:agenda_entry)

      assert {:error, %Ecto.Changeset{}} =
               Sessions.update_agenda_entry(agenda_entry, @invalid_attrs)

      assert agenda_entry == Sessions.get_agenda_entry!(agenda_entry.id)
    end

    test "delete_agenda_entry/1 deletes the agenda_entry" do
      agenda_entry = insert(:agenda_entry)
      assert {:ok, %AgendaEntry{}} = Sessions.delete_agenda_entry(agenda_entry)
      assert_raise Ecto.NoResultsError, fn -> Sessions.get_agenda_entry!(agenda_entry.id) end
    end
  end

  describe "sessions" do
    alias Sozisel.Model.Sessions.Session

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
      use_jitsi: false
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
  end
end
