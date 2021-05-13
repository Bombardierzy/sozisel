defmodule Sozisel.Model.Participants.Participant do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          full_name: String.t(),
          email: String.t(),
          token: String.t(),
          inserted_at: DateTime.t(),
          updated_at: DateTime.t()
        }

  schema "participants" do
    field :email, :string
    field :full_name, :string
    field :token, :string

    timestamps()
  end

  def create_changeset(participant, attrs) do
    participant
    |> cast(attrs, [:email, :full_name])
    |> validate_required([:email, :full_name])
    |> unique_constraint(:email)
    |> validate_format(:email, ~r/@/)
  end

  def update_changeset(participant, attrs) do
    participant
    |> cast(attrs, [:email, :full_name])
    |> validate_required([:email, :full_name])
    |> unique_constraint(:email)
    |> validate_format(:email, ~r/@/)
  end
end
