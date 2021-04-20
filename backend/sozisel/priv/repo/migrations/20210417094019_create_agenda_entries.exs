defmodule Sozisel.Repo.Migrations.CreateAgendaEntries do
  use Ecto.Migration

  def change do
    create table(:agenda_entries) do
      add :name, :string, null: false
      add :start_minute, :integer, null: false

      add :session_template_id, references(:session_templates, on_delete: :delete_all),
        null: false

      timestamps(type: :utc_datetime_usec)
    end

    create index(:agenda_entries, [:session_template_id])
  end
end
