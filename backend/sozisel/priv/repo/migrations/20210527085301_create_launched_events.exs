defmodule Sozisel.Repo.Migrations.CreateLaunchedEvents do
  use Ecto.Migration

  def change do
    create table(:launched_events) do
      add :session_id, references(:sessions, on_delete: :delete_all), null: false
      add :event_id, references(:events, on_delete: :delete_all), null: false

      timestamps(type: :utc_datetime_usec)
    end

    create index(:launched_events, [:session_id])
    create index(:launched_events, [:event_id])

    # ALTERING EVENT RESULTS SCHEMA

    drop index(:event_results, [:event_id])

    alter table(:event_results) do
      remove :event_id
      add :launched_event_id, references(:launched_events, on_delete: :delete_all), null: false
    end

    create index(:event_results, [:launched_event_id])

    create unique_index(:event_results, [:participant_id, :launched_event_id])
  end
end
