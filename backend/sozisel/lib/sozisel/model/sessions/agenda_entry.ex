defmodule Sozisel.Model.Sessions.AgendaEntry do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Sessions.Template

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          name: String.t(),
          start_minute: Integer.t(),
          inserted_at: DateTime.t(),
          updated_at: DateTime.t()
        }

  schema "agenda_entries" do
    field :name, :string
    field :start_minute, :integer
    belongs_to :session_template, Template

    timestamps()
  end

  def create_changeset(agenda_entry, attrs) do
    agenda_entry
    |> cast(attrs, [:name, :start_minute, :session_template_id])
    |> validate_required([:name, :start_minute, :session_template_id])
    |> foreign_key_constraint(:session_template_id)
  end

  def update_changeset(agenda_entry, attrs) do
    agenda_entry
    |> cast(attrs, [:name, :start_minute])
    |> validate_required([:name, :start_minute])
  end
end
