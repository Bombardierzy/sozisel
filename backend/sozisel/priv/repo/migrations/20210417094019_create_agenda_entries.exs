defmodule Sozisel.Repo.Migrations.CreateAgendaEntries do
  use Ecto.Migration

  def change do
    create table(:agenda_entries) do
      add :name, :string
      add :start_minute, :integer
      add :session_template_id, references(:session_templates, on_delete: :nothing)

      timestamps(type: :utc_datetime_usec)
    end

    create index(:agenda_entries, [:session_template_id])
  end
end
