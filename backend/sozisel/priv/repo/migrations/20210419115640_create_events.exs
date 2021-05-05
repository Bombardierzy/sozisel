defmodule Sozisel.Repo.Migrations.CreateEvents do
  use Ecto.Migration

  def change do
    create table(:events) do
      add :name, :string, null: false
      add :start_minute, :integer, null: false
      add :event_data, :map, null: false
      add :session_template_id, references(:session_templates, on_delete: :nothing), null: false

      timestamps(type: :utc_datetime_usec)
    end

    create index(:events, [:session_template_id])
  end
end
