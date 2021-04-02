defmodule Sozisel.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string
      add :first_name, :string
      add :last_name, :string
      add :password_hash, :string

      timestamps(type: :utc_datetime_usec)
    end

    create unique_index(:users, :email)
  end
end
