defmodule Sozisel.Model.Events.Event do
  use Sozisel.Model.Schema
  import Ecto.Changeset
  import PolymorphicEmbed, only: [cast_polymorphic_embed: 3]

  alias Sozisel.Model.Sessions.Template
  alias Sozisel.Model.Quizzes.Quiz
  alias Sozisel.Model.Polls.Poll
  # EVAL alias Sozisel.Model.<%= @module %>s.<%= @module %>
  alias Sozisel.Model.Whiteboards.Whiteboard
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
        poll: [module: Poll, identify_by_fields: [:options]],
        whiteboard: [module: Whiteboard, identify_by_fields: [:task]] #COMMA
        #TODO: implement me!
        # EVAL <%= @event_name %>: [module: <%= @module %>, identify_by_fields: []] #COMMA
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
    |> validate_number(:duration_time_sec, greater_than: 0)
    |> validate_number(:start_minute, greater_than_or_equal_to: 0)
    |> foreign_key_constraint(:session_template_id)
  end

  def update_changeset(event, attrs \\ %{}) do
    event
    |> cast(attrs, [:name, :duration_time_sec, :start_minute])
    |> cast_polymorphic_embed(:event_data, required: true)
    |> validate_required([:name, :duration_time_sec, :start_minute, :event_data])
    |> validate_number(:duration_time_sec, greater_than: 0)
    |> validate_number(:start_minute, greater_than_or_equal_to: 0)
  end
end
