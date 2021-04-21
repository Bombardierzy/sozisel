defmodule Sozisel.Model.Events.Event do
  use Sozisel.Model.Schema
  import Ecto.Changeset
  import PolymorphicEmbed, only: [cast_polymorphic_embed: 3]

  alias Sozisel.Model.Sessions.Template
  alias Sozisel.Model.Quizzes.Quiz

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          name: String.t(),
          start_minute: Integer.t(),
          event_type: PolymorphicEmbed.t(),
          inserted_at: DateTime.t(),
          updated_at: DateTime.t()
        }

  schema "events" do
    field :name, :string
    field :start_minute, :integer

    field :event_type, PolymorphicEmbed,
      types: [
        quiz: Quiz
      ],
      on_type_not_found: :raise,
      on_replace: :update
    belongs_to :session_template, Template

    timestamps()
  end

  def create_changeset(event, attrs \\ %{}) do
    event
    |> cast(attrs, [:name, :start_minute, :session_template_id])
    |> cast_polymorphic_embed(:event_type, required: true)
    |> validate_required([:name, :start_minute, :session_template_id])
    # |> validate_required([:name, :start_minute, :event_type, :session_template_id])
    |> foreign_key_constraint(:session_template_id)
  end

  def update_changeset(event, attrs \\ %{}) do
    event
    |> cast(attrs, [:name, :start_minute])
    |> cast_polymorphic_embed(:event_type, required: true)
    |> validate_required([:name, :start_minute, :event_type])
  end

end
