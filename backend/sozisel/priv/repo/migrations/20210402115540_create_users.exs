defmodule Sozisel.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string, null: false
      add :first_name, :string, null: false
      add :last_name, :string, null: false
      add :password_hash, :string, null: false

      timestamps(type: :utc_datetime_usec)
    end

    create unique_index(:users, :email)
  end
end
