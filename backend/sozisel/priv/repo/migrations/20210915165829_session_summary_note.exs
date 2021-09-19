defmodule Sozisel.Repo.Migrations.SessionSummaryNote do
  use Ecto.Migration

  def change do
    alter table(:sessions) do
      add :summary_note, :text, null: true
    end
  end
end
