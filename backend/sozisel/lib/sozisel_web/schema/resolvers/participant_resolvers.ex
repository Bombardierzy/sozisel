defmodule SoziselWeb.Schema.Resolvers.ParticipantResolvers do
  alias Sozisel.Repo
  alias Sozisel.Model.{Sessions.Session}
  alias Sozisel.Model.{Participants, Participants.Participant}

  require Logger

  # password is optional so we can't always pattern match on all arguments
  def create(
        _parent,
        %{input: %{email: email, full_name: full_name, session_id: session_id} = input},
        _ctx
      ) do
    entry_password = Map.get(input, :entry_password)

    with %Session{entry_password: ^entry_password} <- Repo.get_by(Session, id: session_id),
         {:ok, %Participant{} = participant} <-
           Participants.create_participant(%{
             session_id: session_id,
             email: email,
             full_name: full_name
           }) do
      {:ok, %{token: participant.token}}
    else
      {:error, reason} ->
        Logger.error("Failed to create a participant with reason: #{inspect(reason)}")

        {:error, "failed to create a participant"}

      _ ->
        {:error, "unauthorized"}
    end
  end
end
