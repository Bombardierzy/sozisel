defmodule Sozisel.Model.Events.Event do
  use Sozisel.Model.Schema
  import Ecto.Changeset
  import PolymorphicEmbed, only: [cast_polymorphic_embed: 3]

  alias Sozisel.Model.Sessions.Template
  alias Sozisel.Model.Quizzes.Quiz
  alias Sozisel.Model.Polls.Poll
  alias Sozisel.Model.LaunchedEvents.LaunchedEvent

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          name: String.t(),
          duration_time_sec: Integer.t(),
          start_minute: Integer.t(),
          event_data: PolymorphicEmbed.t(),
          inserted_at: DateTime.t(),
          updated_at: DateTime.t()
        }

  schema "events" do
    field :name, :string
    field :duration_time_sec, :integer
    field :start_minute, :integer

    field :event_data, PolymorphicEmbed,
      types: [
        quiz: [module: Quiz, identify_by_fields: [:quiz_questions]],
        poll: [module: Poll, identify_by_fields: [:options]]
      ],
      on_type_not_found: :raise,
      on_replace: :update

    belongs_to :session_template, Template
    has_many :launched_events, LaunchedEvent

    timestamps()
  end

  def create_changeset(event, attrs \\ %{}) do
    event
    |> cast(attrs, [:name, :duration_time_sec, :start_minute, :session_template_id])
    |> cast_polymorphic_embed(:event_data, required: true)
    |> validate_required([
      :name,
      :duration_time_sec,
      :start_minute,
      :event_data,
      :session_template_id
    ])
    |> foreign_key_constraint(:session_template_id)
  end

  def update_changeset(event, attrs \\ %{}) do
    event
    |> cast(attrs, [:name, :duration_time_sec, :start_minute])
    |> cast_polymorphic_embed(:event_data, required: true)
    |> validate_required([:name, :duration_time_sec, :start_minute, :event_data])
  end
end
