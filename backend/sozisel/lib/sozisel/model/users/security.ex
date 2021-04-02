defmodule Sozisel.Model.Users.Security do
  @doc """
  Takes changeset containing `password` field and adds `password_hash` change
  containing hashed password.
  """
  @spec hash_password(Ecto.Changeset.t()) :: Ecto.Changeset.t()
  def hash_password(%Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset) do
    changeset |> Ecto.Changeset.change(Bcrypt.add_hash(password))
  end

  # either invalid changeset or does not contain password
  def hash_password(changeset), do: changeset

  @doc """
  Verifies user by checking password against his password hash
  """
  @spec verify_user(User.t(), String.t()) :: {:ok, User.t()} | {:error, String.t()}
  def verify_user(user, password) do
    user |> Bcrypt.check_pass(password)
  end
end
