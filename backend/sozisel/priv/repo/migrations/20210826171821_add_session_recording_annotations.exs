defmodule Sozisel.Repo.Migrations.AddSessionRecordingAnnotations do
  use Ecto.Migration

  def change do
    alter table(:session_recordings) do
      add :annotations, {:array, :map}, default: []
    end
  end
end
