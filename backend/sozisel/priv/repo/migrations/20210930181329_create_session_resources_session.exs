defmodule Sozisel.Repo.Migrations.CreateSessionResourcesSessions do
  use Ecto.Migration

  def change do
    create table(:session_resources_sessios) do
      add :session_resource_id, references(:session_resources, on_delete: :delete_all), null: false
      add :session_id, references(:sessions, on_delete: :nothing), null: false
    end

    create unique_index(:session_resources_sessios, [:session_resource_id, :session_id])
  end
end
