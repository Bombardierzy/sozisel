defmodule Sozisel.UsersTest do
  use Sozisel.DataCase

  alias Sozisel.Model.Users
  alias Users.User

  import Sozisel.Factory

  describe "users" do
    @valid_attrs %{
      email: "some@email.com",
      first_name: "some first_name",
      last_name: "some last_name",
      password: "some password"
    }
    @update_attrs %{
      email: "some_updated@email.com",
      first_name: "some updated first_name",
      last_name: "some updated last_name",
      password: "some updated password"
    }
    @invalid_attrs %{email: nil, first_name: nil, last_name: nil, password: nil}

    test "list_users/0 returns all users" do
      user = insert(:user)
      assert Users.list_users() == [user]
    end

    test "get_user!/1 returns the user with given id" do
      user = insert(:user)
      assert Users.get_user!(user.id) == user
    end

    test "create_user/1 with valid data creates a user" do
      assert {:ok, %User{} = user} = Users.create_user(@valid_attrs)
      assert user.email == "some@email.com"
      assert user.first_name == "some first_name"
      assert user.last_name == "some last_name"
      assert {:ok, ^user} = Users.Security.verify_user(user, "some password")
    end

    test "create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Users.create_user(@invalid_attrs)
    end

    test "update_user/2 with valid data updates the user" do
      user = insert(:user, @valid_attrs)
      assert {:ok, %User{} = user} = Users.update_user(user, @update_attrs)
      assert user.email == "some_updated@email.com"
      assert user.first_name == "some updated first_name"
      assert user.last_name == "some updated last_name"
      assert {:ok, ^user} = Users.Security.verify_user(user, "some updated password")
    end

    test "update_user/2 with invalid data returns error changeset" do
      user = insert(:user)
      assert {:error, %Ecto.Changeset{}} = Users.update_user(user, @invalid_attrs)
      assert user == Users.get_user!(user.id)
    end

    test "delete_user/1 deletes the user" do
      user = insert(:user)
      assert {:ok, %User{}} = Users.delete_user(user)
      assert_raise Ecto.NoResultsError, fn -> Users.get_user!(user.id) end
    end
  end
end
