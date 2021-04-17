defmodule Sozisel.Repo.Migrations.CreateSessions do
  use Ecto.Migration

  def change do
    create table(:sessions) do
      add :name, :string
      add :start_time, :utc_datetime_usec
      add :entry_password, :string
      add :use_jitsi, :boolean, default: false, null: false
      add :session_template_id, references(:session_templates, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)

      timestamps(type: :utc_datetime_usec)
    end

    create index(:sessions, [:session_template_id])
    create index(:sessions, [:user_id])
  end
end
