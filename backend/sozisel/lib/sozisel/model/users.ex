defmodule Sozisel.Model.Users do
  @moduledoc """
  The Users context.
  """

  import Ecto.Query, warn: false
  alias Sozisel.Repo

  alias __MODULE__.User

  @spec list_users() :: [User.t()]
  def list_users do
    Repo.all(User)
  end

  @spec get_user!(String.t()) :: User.t()
  def get_user!(id), do: Repo.get!(User, id)

  @spec get_user(String.t()) :: User.t() | nil
  def get_user(id), do: Repo.get(User, id)

  @spec create_user(map()) :: {:ok, User.t()} | {:error, Ecto.Changeset.t()}
  def create_user(attrs) do
    %User{}
    |> User.create_changeset(attrs)
    |> Repo.insert()
  end

  @spec update_user(User.t(), map()) :: {:ok, User.t()} | {:error, Ecto.Changeset.t()}
  def update_user(%User{} = user, attrs) do
    user
    |> User.update_changeset(attrs)
    |> Repo.update()
  end

  @spec delete_user(User.t()) :: {:ok, User.t()} | {:error, Ecto.Changeset.t()}
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end
end
