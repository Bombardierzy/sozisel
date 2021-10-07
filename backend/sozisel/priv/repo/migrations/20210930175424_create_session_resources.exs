defmodule Sozisel.Repo.Migrations.CreateSessionResources do
  use Ecto.Migration

  def change do
    create table(:session_resources) do
      add :path, :string, null: false
      add :filename, :string, null: false
      add :is_public, :boolean, default: false, null: false

      add :user_id, references(:users, on_delete: :delete_all), null: false

      timestamps(type: :utc_datetime_usec)
    end

    create unique_index(:session_resources, [:path])
    create index(:session_resources, [:user_id])
  end
end
