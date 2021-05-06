defmodule SoziselWeb.Schema.Middleware.Authorization do
  @moduledoc """
  Middleware for checking if there is any user in absinthe resolution.
  """

  @behaviour Absinthe.Middleware

  @impl true
  def call(%{context: %{current_user: nil}} = resolution, _params) do
    Absinthe.Resolution.put_result(resolution, {:error, :unauthorized})
  end

  def call(resolution, _params), do: resolution
end
