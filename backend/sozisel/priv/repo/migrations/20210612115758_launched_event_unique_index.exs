defmodule Sozisel.Repo.Migrations.LaunchedEventUniqueIndex do
  use Ecto.Migration

  def change do
    create unique_index(:launched_events, [:event_id, :session_id], name: :unique_launched_event)
  end
end
