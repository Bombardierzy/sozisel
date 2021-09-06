defmodule SoziselWeb.Channels.SharedWhiteboard do
  use SoziselWeb, :channel

  alias Sozisel.SharedWhiteboard, as: SharedWhiteboardHandler

  require Logger

  # TODO: maybe one time add authorization, for now it does not matter
  @impl true
  def join("shared:whiteboard:" <> session_id, _params, socket) do
    with :ok <- SharedWhiteboardHandler.register_listener(session_id),
         {:ok, value} <- SharedWhiteboardHandler.get_value(session_id) do
      {:ok, value, assign(socket, :session_id, session_id)}
    else
      {:error, reason} ->
        Logger.error("Failed to create a shared whiteboard's channel: #{inspect(reason)}")
        {:error, %{reason: "#{inspect(reason)}"}}
    end
  end

  @impl true
  def handle_in("board_update", %{"value" => value}, socket) do
    with {:ok, %{"action" => action, "actionData" => data, "canvasJSON" => json}} <-
           Jason.decode(value),
         :ok <-
           SharedWhiteboardHandler.update_value(socket.assigns.session_id, Jason.encode!(json)) do
      event = Jason.encode!(%{"action" => action, "actionData" => data})
      broadcast!(socket, "board_update", %{value: event})
    end

    {:noreply, socket}
  end
end
