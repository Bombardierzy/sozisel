defmodule Sozisel.SharedWhiteboard do
  use GenServer

  require Logger

  @registry __MODULE__.Registry
  @empty_value "{}"
  # timeout unused board after 3 hours
  @timeout 3 * 60 * 60 * 1000

  @spec registry() :: module()
  def registry(), do: @registry

  @spec channel_name(String.t()) :: String.t()
  def channel_name(session_id) do
    "shared:whiteboard:#{session_id}"
  end

  @spec start(String.t()) :: GenServer.on_start()
  def start(session_id) do
    creator = self()

    GenServer.start(__MODULE__, [session_id, creator],
      name: {:via, Registry, {@registry, session_id}}
    )
  end

  @impl true
  def init([session_id, creator]) do
    Process.monitor(creator)

    {:ok, %{session_id: session_id, value: @empty_value, listeners: 1, timer_ref: nil}}
  end

  @spec lookup(String.t()) :: {:ok, pid() | nil} | {:error, reason :: any()}
  def lookup(session_id) do
    case Registry.lookup(@registry, session_id) do
      [{board_pid, _}] ->
        {:ok, board_pid}

      [] ->
        {:ok, nil}

      {:error, _reason} = error ->
        error
    end
  end

  @spec lookup_or_create(String.t()) ::
          {:ok, pid()} | {:ok, {:new, pid()}} | {:error, reason :: any()}
  def lookup_or_create(session_id) do
    with {:ok, board} when is_pid(board) <- lookup(session_id) do
      {:ok, board}
    else
      {:ok, nil} ->
        case start(session_id) do
          {:ok, board} ->
            {:ok, {:new, board}}

          {:error, _reason} = error ->
            error
        end

      {:error, _reason} = error ->
        error
    end
  end

  @spec update_value(String.t(), String.t()) :: :ok | {:error, reason :: any()}
  def update_value(session_id, value) do
    with {:ok, board} <- lookup(session_id) do
      GenServer.cast(board, {:update, value})
    else
      other ->
        Logger.info("Received other while trying to update board state, #{inspect(other)}")
        :ok
    end
  end

  @spec register_listener(String.t()) :: :ok | {:error, reason :: any()}
  def register_listener(session_id) do
    case lookup_or_create(session_id) do
      {:ok, {:new, _board_pid}} ->
        :ok

      {:ok, pid} when is_pid(pid) ->
        GenServer.call(pid, {:register_listener, self()})

      {:error, _reason} = error ->
        error
    end
  end

  @spec get_value(String.t()) :: {:ok, String.t() | nil} | {:error, reason :: any()}
  def get_value(session_id) do
    case lookup(session_id) do
      {:ok, nil} ->
        {:ok, nil}

      {:ok, board} ->
        {:ok, GenServer.call(board, :get)}

      {:error, _reason} = error ->
        error
    end
  end

  @impl true
  def handle_call(:get, _from, state) do
    {:reply, state.value, state}
  end

  @impl true
  def handle_call({:register_listener, listener}, _from, state) do
    Process.monitor(listener)

    unless is_nil(state[:timer_ref]) do
      Process.cancel_timer(state.timer_ref)
    end

    {:reply, :ok, Map.update!(state, :listeners, &(&1 + 1)) |> Map.put(:timer_ref, nil)}
  end

  @impl true
  def handle_cast({:update, value}, state) do
    {:noreply, Map.replace(state, :value, value)}
  end

  @impl true
  def handle_info(%{event: "board_update", payload: %{"value" => value}}, state) do
    with {:ok, parsed} <- Jason.decode(value) do
      json = Map.get(parsed, "canvasJSON", "{}")

      {:noreply, Map.replace(state, :value, json)}
    else
      {:error, reason} ->
        Logger.error("Failed to handle board update, #{inspect(reason)}")
        {:noreply, state}
    end
  end

  @impl true
  def handle_info({:DOWN, _ref, :process, _pid, _reason}, state) do
    if state.listeners - 1 <= 0 do
      timer_ref = set_inactive_timeout()

      Logger.info(
        "Setting inactive timeout for shared whiteboard for session #{state.session_id}, no active listeners..."
      )

      Map.put(state, :timer_ref, timer_ref)
    else
      Map.update!(state, :listeners, &(&1 - 1))
    end
    |> then(&{:noreply, Map.update!(&1, :listeners, fn listeners -> listeners - 1 end)})
  end

  @impl true
  def handle_info(:inactive_check, state) do
    Logger.info(
      "Shared whiteboard for session #{state.session_id} is no longer active, stopping..."
    )

    {:stop, :normal, state}
  end

  defp set_inactive_timeout() do
    Process.send_after(self(), :inactive_check, @timeout)
  end
end
