defmodule Sozisel.Model.Events.Event do
  use Sozisel.Model.Schema
  import Ecto.Changeset
  import PolymorphicEmbed, only: [cast_polymorphic_embed: 3]

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          name: String.t(),
          # first_name: String.t(),
          # last_name: String.t(),
          # password_hash: String.t(),
          # password: String.t() | nil,
          # inserted_at: DateTime.t(),
          # updated_at: DateTime.t()
          inserted_at: DateTime.t(),
          updated_at: DateTime.t()
        }

  schema "events" do
    field :event_type, PolymorphicEmbed,
      types: [
        # quiz: Sozisel.Quizzes.Quiz
        quiz: [module: Sozisel.Quizzes.Quiz, identify_by_fields: [:quiz_questions]]
      ],
      on_type_not_found: :raise,
      on_replace: :update

    field :name, :string
    field :start_minute, :integer
    # field :session_template_id, :id

    timestamps()
  end

  @doc false
  def changeset(event, attrs) do
    event
    # |> cast(attrs, [:name, :start_minute, :type])
    |> cast(attrs, [:name])
    |> cast_polymorphic_embed(:event_type, required: true)
    # |> validate_required([:name, :start_minute, :type])
    |> validate_required([:name])
  end
end
