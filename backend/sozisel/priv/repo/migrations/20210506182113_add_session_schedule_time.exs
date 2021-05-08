defmodule Sozisel.Repo.Migrations.AddSessionScheduleTime do
  use Ecto.Migration

  def change do
    alter table(:sessions) do
      add :scheduled_start_time, :utc_datetime_usec, null: false
      modify :start_time, :utc_datetime_usec, null: true
      add :end_time, :utc_datetime_usec, null: true
    end
  end
end
