defmodule Sozisel.Model.Participants do
  @moduledoc """
  The Participants context.
  """

  import Ecto.Query, warn: false
  alias Sozisel.Repo

  alias Sozisel.Model.Participants.Participant

  def list_participants do
    Repo.all(Participant)
  end

  def get_participant!(id), do: Repo.get!(Participant, id)
  
  def create_participant(attrs \\ %{}) do
    %Participant{}
    |> Participant.create_changeset(attrs)
    |> Repo.insert()
  end

  def delete_participant(%Participant{} = participant) do
    Repo.delete(participant)
  end

  def change_participant(%Participant{} = participant, attrs \\ %{}) do
    Participant.create_changeset(participant, attrs)
  end

  def generate_token(%Ecto.Changeset{valid?: true, changes: %{full_name: full_name, email: email}} = changeset) do
    token = :crypto.hash(:md5 , full_name <> email) |> Base.encode16()
    changeset |> Ecto.Changeset.change(%{token: token})
  end

  def generate_token(changeset), do: changeset
end
