defmodule Sozisel.Repo.Migrations.CreateSessions do
  use Ecto.Migration

  def change do
    create table(:sessions) do
      add :name, :string, null: false
      add :start_time, :utc_datetime_usec, null: false
      add :entry_password, :string
      add :use_jitsi, :boolean, default: false, null: false
      add :session_template_id, references(:session_templates, on_delete: :nothing), null: false
      add :user_id, references(:users, on_delete: :nothing), null: false

      timestamps(type: :utc_datetime_usec)
    end

    create index(:sessions, [:session_template_id])
    create index(:sessions, [:user_id])
  end
end
