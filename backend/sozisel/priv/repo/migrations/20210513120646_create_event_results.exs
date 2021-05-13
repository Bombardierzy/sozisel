defmodule Sozisel.Repo.Migrations.CreateEventResults do
  use Ecto.Migration

  def change do
    create table(:event_results) do
      add :result_data, :string
      add :participant_token, references(:participants, type: :string, column: :token_id, on_delete: :nothing), null: false

      timestamps(type: :utc_datetime_usec)
    end

  end
end
