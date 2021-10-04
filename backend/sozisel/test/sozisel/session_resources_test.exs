defmodule Sozisel.SessionResourcesTest do
  use Sozisel.DataCase

  alias Sozisel.Model.{SessionResources, SessionResources.SessionResource}

  import Sozisel.Factory

  describe "session_recordings" do
    @valid_attrs %{
      path: "some path", 
      is_public: false
    }

    @invalid_attrs %{
      path: nil, 
      is_public: true
    }

    setup do
      [user: insert(:user)]
    end

    def session_resource_fixture(%{user: user}) do
      {:ok, session_resource} =
        %{}
        |> Enum.into(@valid_attrs)
        |> Map.put(:user_id, user.id)
        |> SessionResources.create_session_resource()

      session_resource
    end

    # test "list_session_resources/0 returns all session_resources", ctx do
    #   session_resource = session_resource_fixture(ctx)
    #   assert SessionResources.list_session_resources() == [session_resource]
    # end

    test "get_session_resource!/1 returns the session_resource with given id", ctx do
      session_resource = session_resource_fixture(ctx)
      assert SessionResources.get_session_resource!(session_resource.id) == session_resource
    end

    test "create_session_resource/1 with valid data creates a session_resource", ctx do
      assert {:ok, %SessionResource{} = session_resource} =
               SessionResources.create_session_resource(
                 @valid_attrs
                 |> Map.put(:user_id, ctx.user.id)
               )

      assert session_resource.path == "some path"
      assert session_resource.user_id == ctx.user.id
      assert session_resource.is_public == false

    end

    test "create_session_resource/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} =
               SessionResources.create_session_resource(@invalid_attrs)
    end

    test "delete_session_resource/1 deletes the session_resource", ctx do
      session_resource = session_resource_fixture(ctx)

      assert {:ok, %SessionResource{}} =
               SessionResources.delete_session_resource(session_resource)

      assert_raise Ecto.NoResultsError, fn ->
        SessionResources.get_session_resource!(session_resource.id)
      end
    end

    test "change_session_resource/1 returns a session_resource changeset", ctx do
      session_resource = session_resource_fixture(ctx)
      assert %Ecto.Changeset{} = SessionResources.change_session_resource(session_resource)
    end
  end
end
