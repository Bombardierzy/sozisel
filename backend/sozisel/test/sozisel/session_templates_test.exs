defmodule Sozisel.SessionTemplatesTest do
  use Sozisel.DataCase

  alias Sozisel.Model.Sessions
  alias Sozisel.Model.Sessions.Template

  import Sozisel.Factory

  describe "session_templates" do
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
end
