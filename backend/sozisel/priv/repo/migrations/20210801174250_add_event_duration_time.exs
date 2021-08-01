defmodule Sozisel.Repo.Migrations.AddEventDurationTime do
  use Ecto.Migration

  def change do
    alter table(:events) do
      add :duration_time_sec, :integer, default: 60, null: false
    end
  end
end
