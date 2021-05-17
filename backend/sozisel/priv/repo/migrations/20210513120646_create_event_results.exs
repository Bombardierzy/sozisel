defmodule Sozisel.Repo.Migrations.CreateEventResults do
  use Ecto.Migration

  def change do
    create table(:event_results) do
      add :result_data, :string
      add :participant_id, references(:participants, on_delete: :nothing), null: false
      
      timestamps(type: :utc_datetime_usec)
    end

    create index(:event_results, [:participant_id])
  end
end
