defmodule Sozisel.AgendaEntriesTest do
  use Sozisel.DataCase

  alias Sozisel.Model.Sessions
  alias Sozisel.Model.Sessions.AgendaEntry

  import Sozisel.Factory

  describe "agenda_entries" do
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
end
