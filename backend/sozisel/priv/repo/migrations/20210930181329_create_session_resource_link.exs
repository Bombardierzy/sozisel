defmodule Sozisel.Repo.Migrations.CreateSessionResourceLinks do
  use Ecto.Migration

  def change do
    create table(:session_resource_links) do
      add :is_public, :boolean, default: false, null: false

      add :session_resource_id, references(:session_resources, on_delete: :delete_all),
        null: false

      add :session_id, references(:sessions, on_delete: :nothing), null: false

      timestamps(type: :utc_datetime_usec)
    end

    create unique_index(:session_resource_links, [:session_resource_id, :session_id, :is_public])
  end
end
