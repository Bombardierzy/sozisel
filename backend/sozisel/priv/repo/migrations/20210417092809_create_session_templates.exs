defmodule Sozisel.Repo.Migrations.CreateSessionTemplates do
  use Ecto.Migration

  def change do
    create table(:session_templates) do
      add :name, :string, null: false
      add :estimated_time, :integer, null: false
      add :is_public, :boolean, default: false, null: false
      add :deleted_at, :utc_datetime_usec
      add :user_id, references(:users, on_delete: :nothing), null: false

      timestamps(type: :utc_datetime_usec)
    end

    create index(:session_templates, [:user_id])
  end
end
