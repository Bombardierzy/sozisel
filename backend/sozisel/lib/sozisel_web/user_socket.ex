defmodule SoziselWeb.UserSocket do
  use Phoenix.Socket

  channel "session:participation:*", SoziselWeb.Channels.SessionParticipantsPresence

  use Absinthe.Phoenix.Socket,
    schema: SoziselWeb.Schema

  @impl true
  def connect(_params, socket, _connect_info) do
    {:ok, socket}
  end

  @impl true
  def id(_socket), do: nil
end
