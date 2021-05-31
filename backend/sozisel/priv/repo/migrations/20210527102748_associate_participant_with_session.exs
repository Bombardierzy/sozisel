defmodule Sozisel.Repo.Migrations.AssociateParticipantWithSession do
  use Ecto.Migration

  def change do
    alter table(:participants) do
      add :session_id, references(:sessions, on_delete: :delete_all), null: false
    end

    create index(:participants, [:session_id])
  end
end
