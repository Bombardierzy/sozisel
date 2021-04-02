defmodule SoziselWeb do
  @moduledoc false

  def router do
    quote do
      use Phoenix.Router

      import Plug.Conn
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
