defmodule Sozisel.Repo.Migrations.CreateSessionRecordings do
  use Ecto.Migration

  def change do
    create table(:session_recordings) do
      add :path, :string, null: false
      add :metadata, :map, null: false
      add :session_id, references(:sessions, on_delete: :delete_all)

      timestamps()
    end

    create unique_index(:session_recordings, [:session_id])
  end
end
