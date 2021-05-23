defmodule SoziselWeb.Channels.SessionParticipantsPresence do
  use SoziselWeb, :channel
  alias SoziselWeb.Presence
  alias Sozisel.Model.{Sessions, Sessions.Session}

  # def join("session:participation:" <> session_id, %{"displayName" => display_name}, socket) do
  #   with %Session{start_time: start_time, end_time: nil} when not is_nil(start_time) <- Sessions.get_session(session_id) do
  #     send(self(), :after_join)
  #     {:ok, assign(socket, :display_name, display_name)}
  #   else
  #     %Session{start_time: nil} ->
  #       {:error, "Session has not started yet"}

  #     %Session{} ->
  #       {:error, "Session has already ended"}

  #     nil ->
  #       {:error, "Session not found"}
  #   end
  # end

  def join("session:participation:" <> session_id, %{"displayName" => display_name}, socket) do
    send(self(), :after_join)
    {:ok, assign(socket, :display_name, display_name)}
  end

  def handle_info(:after_join, socket) do
    id = Ecto.UUID.generate()

    {:ok, _} =
      Presence.track(socket, id, %{
        display_name: socket.assigns.display_name
      })

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, assign(socket, :participant_id, id)}
  end

  def handle_info(%{event: "presence_diff", payload: payload}, socket) do
    push(socket, "presence_diff", payload)
    {:noreply, socket}
  end
end
