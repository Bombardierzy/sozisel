defmodule SoziselWeb.UserSocket do
  use Phoenix.Socket

  channel "session:participation:*", SoziselWeb.Channels.SessionParticipantsPresence
  channel "shared:whiteboard:*", SoziselWeb.Channels.SharedWhiteboard

  use Absinthe.Phoenix.Socket,
    schema: SoziselWeb.Schema

  @impl true
  def connect(params, socket, _connect_info) do
    SoziselWeb.Context.create_socket_context(socket, params)
  end

  @impl true
  def id(_socket), do: nil
end
