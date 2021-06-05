defmodule SoziselWeb.Channels.SessionParticipantsPresence do
  use SoziselWeb, :channel
  alias SoziselWeb.Presence
  alias Sozisel.Model.{Participants, Sessions, Users}
  alias Participants.Participant
  alias Sessions.Session
  alias Users.{Token, User}

  def join(
        "session:participation:" <> session_id,
        %{"participantToken" => participant_token},
        socket
      ) do
    with %Participant{id: id, full_name: full_name, session_id: ^session_id} <-
           Participants.find_by_token(participant_token) do
      send(self(), :after_join)

      info = %{
        id: id,
        display_name: full_name,
        type: :participant
      }

      {:ok, assign(socket, :info, info)}
    else
      _ ->
        {:error, "unauthorized"}
    end
  end

  def join("session:participation:" <> session_id, %{"presenterToken" => presenter_token}, socket) do
    with {:ok, %User{id: user_id} = user} <- Token.retrieve_user(presenter_token),
         %Session{user_id: ^user_id} <- Sessions.get_session(session_id) do
      send(self(), :after_join)

      info = %{
        id: user_id,
        display_name: user.first_name <> " " <> user.last_name,
        type: :presenter
      }

      {:ok, assign(socket, :info, info)}
    else
      _ ->
        {:error, "unauthorized"}
    end
  end

  def handle_info(:after_join, socket) do
    id = Ecto.UUID.generate()

    {:ok, _} = Presence.track(socket, id, socket.assigns.info)

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, assign(socket, :participant_id, id)}
  end

  def handle_info(%{event: "presence_diff", payload: payload}, socket) do
    push(socket, "presence_diff", payload)
    {:noreply, socket}
  end
end
