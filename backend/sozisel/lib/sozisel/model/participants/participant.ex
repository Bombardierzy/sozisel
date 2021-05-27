defmodule Sozisel.Model.Participants.Participant do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  alias Sozisel.Model.Participants
  alias Sozisel.Model.EventResults.EventResult
  alias Sozisel.Model.Sessions.Session

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          full_name: String.t(),
          email: String.t(),
          token: String.t(),
          session_id: Ecto.UUID.t(),
          session: Session.t() | Ecto.Association.NotLoaded.t(),
          inserted_at: DateTime.t(),
          updated_at: DateTime.t()
        }

  schema "participants" do
    field :email, :string
    field :full_name, :string
    field :token, :string

    has_many :event_results, EventResult
    belongs_to :session, Session

    timestamps()
  end

  def create_changeset(participant, attrs) do
    participant
    |> cast(attrs, [:email, :full_name, :session_id])
    |> validate_required([:email, :full_name, :session_id])
    |> unique_constraint(:email)
    |> validate_format(:email, ~r/@/)
    |> foreign_key_constraint(:session_id)
    |> Participants.generate_token()
  end
end
