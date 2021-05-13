defmodule Sozisel.Repo.Migrations.CreateParticipants do
  use Ecto.Migration

  def change do
    create table(:participants) do
      add :full_name, :string
      add :email, :string
      add :token_id, :string

      timestamps(type: :utc_datetime_usec)
    end

    create unique_index(:participants, :token_id)
  end
end
