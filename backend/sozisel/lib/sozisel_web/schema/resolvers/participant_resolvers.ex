defmodule SoziselWeb.Schema.Resolvers.ParticipantResolvers do
  alias Sozisel.Repo
  alias Sozisel.Model.{Sessions.Session}
  alias Sozisel.Model.{Participants, Participants.Participant}

  def create(_parent, %{input: %{email: email, full_name: full_name, session_id: session_id, entry_password: entry_password}}, _ctx) do
    with %Session{} = session <- Repo.get_by(Session, id: session_id),
        #  true <- session.entry_password == entry_password,
         %Participant{} = participant <- Participants.create_participant(%{email: email, full_name: full_name}) do
      {:ok, %{token: participant.token, id: participant.id}}
    else
      _ ->
        {:error, "wrong password"}
    end
  end
end
