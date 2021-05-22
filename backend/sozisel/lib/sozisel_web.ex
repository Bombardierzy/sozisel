defmodule SoziselWeb do
  @moduledoc false

  def router do
    quote do
      use Phoenix.Router

      import Plug.Conn
    end
  end

  def view do
    quote do
      use Phoenix.View,
        root: "lib/sozisel_web/templates",
        namespace: SoziselWeb
    end
  end

  def channel do
    quote do
      use Phoenix.Channel
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
