defmodule Sozisel.UserTokenTest do
  use Sozisel.DataCase

  alias Sozisel.Model.Users.Token

  import Sozisel.Factory

  describe "token" do
    setup do
      [user: insert(:user)]
    end

    test "generate/1 should generate a valid jwt token", ctx do
      token = Token.generate(ctx.user)
      assert is_binary(token)
    end

    test "retrieve_user/1 should return corresponding token's user", ctx do
      %{user: user} = ctx
      token = Token.generate(user)
      assert {:ok, ^user} = Token.retrieve_user(token)
    end

    test "retrieve_user/1 should return an error on invalid token" do
      assert {:error, :invalid_token} = Token.retrieve_user("some invalid token")
      assert {:error, :invalid_token} = Token.retrieve_user(nil)
    end
  end
end
