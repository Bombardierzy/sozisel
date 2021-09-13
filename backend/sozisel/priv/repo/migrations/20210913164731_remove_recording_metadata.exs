defmodule Sozisel.Repo.Migrations.RemoveRecordingMetadata do
  use Ecto.Migration

  def change do
    alter table(:session_recordings) do
      remove_if_exists(:metadata, :map)
    end
  end
end
