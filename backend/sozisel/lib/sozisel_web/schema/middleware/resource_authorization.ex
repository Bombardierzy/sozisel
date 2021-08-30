defmodule SoziselWeb.Schema.Middleware.ResourceAuthorization do
  @moduledoc """
  Middleware for loading a resource and checking if current user is allowed
  to access it for a specific method declared in `Sozisel.Model.Bodyguard` module.

  If user is authorized to access the resource, it will be stored in resolution and
  then it can be accessed via `fetch_resource/1`.

  Current user is expected to be found in resolution's context whereas resource id is expected
  in arguments map either directly under `:id` key or as nested `:id` key under `:input` map.

  **IMPORTANT**
   - A situation where resource has not been found is treated as an unauthorized event.

  TODO:
  For not the middleware allows just for a single check of resource authorization for a whole query resolution.
  Allow for multiple resource checking but just when necessary.
  """

  alias Sozisel.Repo

  require Logger

  defmacrop unauthorized_resolution(resolution) do
    quote do
      Absinthe.Resolution.put_result(unquote(resolution), {:error, :unauthorized})
    end
  end

  @behaviour Absinthe.Middleware

  @impl true
  def call(%{state: :resolved} = resolution, _params), do: resolution

  def call(%{context: %{current_user: nil}} = resolution, _params) do
    unauthorized_resolution(resolution)
  end

  def call(resolution, {method, resource_type}) do
    user = resolution_user(resolution)
    resource_id = resolution_resource_id(resolution)

    with %resource_type{} = resource <- Repo.get(resource_type, resource_id),
         :ok <- Sozisel.Model.Bodyguard.authorize(method, user, resource) do
      resolution |> Map.put(:__resource__, {resource_type, resource})
    else
      result ->
        Logger.warn(
          "[#{inspect(__MODULE__)}] Failed to authroize resource, received result: #{inspect(result)}"
        )

        unauthorized_resolution(resolution)
    end
  end

  @doc """
  Fetches resource of given type from absinthe's resolution.

  Raises if resource of given type has not been found.
  """
  @spec fetch_resource!(Absinthe.Resolution.t(), module()) :: any()
  def fetch_resource!(resolution, resource_type) do
    {^resource_type, resource} = resolution |> Map.fetch!(:__resource__)

    resource
  end

  defp resolution_user(%{context: %{current_user: user}}), do: user

  defp resolution_resource_id(%{arguments: %{id: id}}), do: id
  defp resolution_resource_id(%{arguments: %{input: %{id: id}}}), do: id
end
