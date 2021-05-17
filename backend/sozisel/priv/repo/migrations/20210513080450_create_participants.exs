defmodule Sozisel.Repo.Migrations.CreateParticipants do
  use Ecto.Migration

  def change do
    create table(:participants) do
      add :full_name, :string, null: false
      add :email, :string, null: false
      add :token, :string, null: false

      timestamps(type: :utc_datetime_usec)
    end

    create unique_index(:participants, :token)
  end
end
