defmodule Sozisel.Repo.Migrations.CreateSessionTemplates do
  use Ecto.Migration

  def change do
    create table(:session_templates) do
      add :name, :string
      add :estimated_time, :integer
      add :is_abstract, :boolean, default: false, null: false
      add :is_public, :boolean, default: false, null: false
      add :deleted_at, :utc_datetime_usec
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:session_templates, [:user_id])
  end
end
