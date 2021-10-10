defmodule Sozisel.SessionResourceLinksTest do
  use Sozisel.DataCase

  alias Sozisel.Model.{SessionResourceLinks, SessionResourceLinks.SessionResourceLink}

  import Sozisel.Factory

  describe "session_resource_links" do
    setup do
      user = insert(:user)
      session = insert(:session, %{user_id: user.id})
      [user: user, session: session, session_resource: insert(:session_resource)]
    end

    def session_resource_link_fixture(%{session_resource: session_resource, session: session}) do
      {:ok, session_resource_link} =
        %{
          is_public: true,
          session_resource_id: session_resource.id,
          session_id: session.id
        }
        |> SessionResourceLinks.create_session_resource_link()

      session_resource_link
    end

    test "list_session_resource_links/0 returns all session_resource_links", ctx do
      session_resource_link = session_resource_link_fixture(ctx)
      assert SessionResourceLinks.list_session_resource_links() == [session_resource_link]
    end

    test "get_session_resource_link!/1 returns the session_resource_link with given id", ctx do
      session_resource_link = session_resource_link_fixture(ctx)

      assert SessionResourceLinks.get_session_resource_link!(session_resource_link.id) ==
               session_resource_link
    end

    test "create_session_resource_link/1 with valid data creates a session_resource_link", ctx do
      assert {:ok, %SessionResourceLink{} = session_resource_link} =
               SessionResourceLinks.create_session_resource_link(
                 %{is_public: true}
                 |> Map.put(:session_id, ctx.session.id)
                 |> Map.put(:session_resource_id, ctx.session_resource.id)
               )

      assert session_resource_link.is_public == true
      assert session_resource_link.session_id == ctx.session.id
      assert session_resource_link.session_resource_id == ctx.session_resource.id
    end

    test "create_session_resource_link/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} =
               SessionResourceLinks.create_session_resource_link(%{is_public: nil})
    end

    test "update_session_resource_link/2 with valid data updates the session_resource_link",
         ctx do
      session_resource_link = session_resource_link_fixture(ctx)

      assert {:ok, %SessionResourceLink{} = session_resource_link} =
               SessionResourceLinks.update_session_resource_link(session_resource_link, %{
                 is_public: false
               })

      assert session_resource_link.is_public == false
      assert session_resource_link.session_id == ctx.session.id
      assert session_resource_link.session_resource_id == ctx.session_resource.id
    end

    test "update_session_resource_link/2 with invalid data returns error changeset", ctx do
      session_resource_link = session_resource_link_fixture(ctx)

      assert {:error, %Ecto.Changeset{}} =
               SessionResourceLinks.update_session_resource_link(session_resource_link, %{
                 is_public: 0
               })

      assert session_resource_link ==
               SessionResourceLinks.get_session_resource_link!(session_resource_link.id)
    end

    test "delete_session_resource_link/1 deletes the session_resource_link", ctx do
      session_resource_link = session_resource_link_fixture(ctx)

      assert {:ok, %SessionResourceLink{}} =
               SessionResourceLinks.delete_session_resource_link(session_resource_link)

      assert_raise Ecto.NoResultsError, fn ->
        SessionResourceLinks.get_session_resource_link!(session_resource_link.id)
      end
    end

    test "change_session_resource_link/1 returns a session_resource_link changeset", ctx do
      session_resource_link = session_resource_link_fixture(ctx)

      assert %Ecto.Changeset{} =
               SessionResourceLinks.change_session_resource_link(session_resource_link)
    end
  end
end
