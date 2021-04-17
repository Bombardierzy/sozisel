defmodule Sozisel.SessionsTest do
  # use Sozisel.DataCase

  # alias Sozisel.Model.Sessions

  # describe "session_templates" do
  #   alias Sozisel.Model.Sessions.Template

  #   @valid_attrs %{deleted_at: "2010-04-17T14:00:00.000000Z", esimated_time: 42, is_abstract: true, is_public: true, name: "some name"}
  #   @update_attrs %{deleted_at: "2011-05-18T15:01:01.000000Z", esimated_time: 43, is_abstract: false, is_public: false, name: "some updated name"}
  #   @invalid_attrs %{deleted_at: nil, esimated_time: nil, is_abstract: nil, is_public: nil, name: nil}

  #   def template_fixture(attrs \\ %{}) do
  #     {:ok, template} =
  #       attrs
  #       |> Enum.into(@valid_attrs)
  #       |> Sessions.create_template()

  #     template
  #   end

  #   test "list_session_templates/0 returns all session_templates" do
  #     template = template_fixture()
  #     assert Sessions.list_session_templates() == [template]
  #   end

  #   test "get_template!/1 returns the template with given id" do
  #     template = template_fixture()
  #     assert Sessions.get_template!(template.id) == template
  #   end

  #   test "create_template/1 with valid data creates a template" do
  #     assert {:ok, %Template{} = template} = Sessions.create_template(@valid_attrs)
  #     assert template.deleted_at == DateTime.from_naive!(~N[2010-04-17T14:00:00.000000Z], "Etc/UTC")
  #     assert template.esimated_time == 42
  #     assert template.is_abstract == true
  #     assert template.is_public == true
  #     assert template.name == "some name"
  #   end

  #   test "create_template/1 with invalid data returns error changeset" do
  #     assert {:error, %Ecto.Changeset{}} = Sessions.create_template(@invalid_attrs)
  #   end

  #   test "update_template/2 with valid data updates the template" do
  #     template = template_fixture()
  #     assert {:ok, %Template{} = template} = Sessions.update_template(template, @update_attrs)
  #     assert template.deleted_at == DateTime.from_naive!(~N[2011-05-18T15:01:01.000000Z], "Etc/UTC")
  #     assert template.esimated_time == 43
  #     assert template.is_abstract == false
  #     assert template.is_public == false
  #     assert template.name == "some updated name"
  #   end

  #   test "update_template/2 with invalid data returns error changeset" do
  #     template = template_fixture()
  #     assert {:error, %Ecto.Changeset{}} = Sessions.update_template(template, @invalid_attrs)
  #     assert template == Sessions.get_template!(template.id)
  #   end

  #   test "delete_template/1 deletes the template" do
  #     template = template_fixture()
  #     assert {:ok, %Template{}} = Sessions.delete_template(template)
  #     assert_raise Ecto.NoResultsError, fn -> Sessions.get_template!(template.id) end
  #   end

  #   test "change_template/1 returns a template changeset" do
  #     template = template_fixture()
  #     assert %Ecto.Changeset{} = Sessions.change_template(template)
  #   end
  # end

  # describe "agenda_entries" do
  #   alias Sozisel.Model.Sessions.AgendaEntry

  #   @valid_attrs %{name: "some name", start_minute: 42}
  #   @update_attrs %{name: "some updated name", start_minute: 43}
  #   @invalid_attrs %{name: nil, start_minute: nil}

  #   def agenda_entry_fixture(attrs \\ %{}) do
  #     {:ok, agenda_entry} =
  #       attrs
  #       |> Enum.into(@valid_attrs)
  #       |> Sessions.create_agenda_entry()

  #     agenda_entry
  #   end

  #   test "list_agenda_entries/0 returns all agenda_entries" do
  #     agenda_entry = agenda_entry_fixture()
  #     assert Sessions.list_agenda_entries() == [agenda_entry]
  #   end

  #   test "get_agenda_entry!/1 returns the agenda_entry with given id" do
  #     agenda_entry = agenda_entry_fixture()
  #     assert Sessions.get_agenda_entry!(agenda_entry.id) == agenda_entry
  #   end

  #   test "create_agenda_entry/1 with valid data creates a agenda_entry" do
  #     assert {:ok, %AgendaEntry{} = agenda_entry} = Sessions.create_agenda_entry(@valid_attrs)
  #     assert agenda_entry.name == "some name"
  #     assert agenda_entry.start_minute == 42
  #   end

  #   test "create_agenda_entry/1 with invalid data returns error changeset" do
  #     assert {:error, %Ecto.Changeset{}} = Sessions.create_agenda_entry(@invalid_attrs)
  #   end

  #   test "update_agenda_entry/2 with valid data updates the agenda_entry" do
  #     agenda_entry = agenda_entry_fixture()
  #     assert {:ok, %AgendaEntry{} = agenda_entry} = Sessions.update_agenda_entry(agenda_entry, @update_attrs)
  #     assert agenda_entry.name == "some updated name"
  #     assert agenda_entry.start_minute == 43
  #   end

  #   test "update_agenda_entry/2 with invalid data returns error changeset" do
  #     agenda_entry = agenda_entry_fixture()
  #     assert {:error, %Ecto.Changeset{}} = Sessions.update_agenda_entry(agenda_entry, @invalid_attrs)
  #     assert agenda_entry == Sessions.get_agenda_entry!(agenda_entry.id)
  #   end

  #   test "delete_agenda_entry/1 deletes the agenda_entry" do
  #     agenda_entry = agenda_entry_fixture()
  #     assert {:ok, %AgendaEntry{}} = Sessions.delete_agenda_entry(agenda_entry)
  #     assert_raise Ecto.NoResultsError, fn -> Sessions.get_agenda_entry!(agenda_entry.id) end
  #   end

  #   test "change_agenda_entry/1 returns a agenda_entry changeset" do
  #     agenda_entry = agenda_entry_fixture()
  #     assert %Ecto.Changeset{} = Sessions.change_agenda_entry(agenda_entry)
  #   end
  # end

  # describe "sessions" do
  #   alias Sozisel.Model.Sessions.Session

  #   @valid_attrs %{entry_password: "some entry_password", name: "some name", start_time: "2010-04-17T14:00:00.000000Z", use_jitsi: true}
  #   @update_attrs %{entry_password: "some updated entry_password", name: "some updated name", start_time: "2011-05-18T15:01:01.000000Z", use_jitsi: false}
  #   @invalid_attrs %{entry_password: nil, name: nil, start_time: nil, use_jitsi: nil}

  #   def session_fixture(attrs \\ %{}) do
  #     {:ok, session} =
  #       attrs
  #       |> Enum.into(@valid_attrs)
  #       |> Sessions.create_session()

  #     session
  #   end

  #   test "list_sessions/0 returns all sessions" do
  #     session = session_fixture()
  #     assert Sessions.list_sessions() == [session]
  #   end

  #   test "get_session!/1 returns the session with given id" do
  #     session = session_fixture()
  #     assert Sessions.get_session!(session.id) == session
  #   end

  #   test "create_session/1 with valid data creates a session" do
  #     assert {:ok, %Session{} = session} = Sessions.create_session(@valid_attrs)
  #     assert session.entry_password == "some entry_password"
  #     assert session.name == "some name"
  #     assert session.start_time == DateTime.from_naive!(~N[2010-04-17T14:00:00.000000Z], "Etc/UTC")
  #     assert session.use_jitsi == true
  #   end

  #   test "create_session/1 with invalid data returns error changeset" do
  #     assert {:error, %Ecto.Changeset{}} = Sessions.create_session(@invalid_attrs)
  #   end

  #   test "update_session/2 with valid data updates the session" do
  #     session = session_fixture()
  #     assert {:ok, %Session{} = session} = Sessions.update_session(session, @update_attrs)
  #     assert session.entry_password == "some updated entry_password"
  #     assert session.name == "some updated name"
  #     assert session.start_time == DateTime.from_naive!(~N[2011-05-18T15:01:01.000000Z], "Etc/UTC")
  #     assert session.use_jitsi == false
  #   end

  #   test "update_session/2 with invalid data returns error changeset" do
  #     session = session_fixture()
  #     assert {:error, %Ecto.Changeset{}} = Sessions.update_session(session, @invalid_attrs)
  #     assert session == Sessions.get_session!(session.id)
  #   end

  #   test "delete_session/1 deletes the session" do
  #     session = session_fixture()
  #     assert {:ok, %Session{}} = Sessions.delete_session(session)
  #     assert_raise Ecto.NoResultsError, fn -> Sessions.get_session!(session.id) end
  #   end

  #   test "change_session/1 returns a session changeset" do
  #     session = session_fixture()
  #     assert %Ecto.Changeset{} = Sessions.change_session(session)
  #   end
  # end
end
