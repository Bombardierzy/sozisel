defmodule SoziselWeb.Schema.Notation do
  use Absinthe.Schema.Notation

  @doc """
  Macro used for creating non-nullable list of non-nullable elements of given type
  """
  defmacro strong_list_of(type) do
    quote do
      non_null(list_of(non_null(unquote(type))))
    end
  end

  defmacro timestamps() do
    quote do
      field :inserted_at, non_null(:datetime) do
        resolve(fn %{inserted_at: date}, _, _ ->
          {:ok, date}
        end)
      end

      field :updated_at, non_null(:datetime) do
        resolve(fn %{updated_at: date}, _, _ ->
          {:ok, date}
        end)
      end
    end
  end

  defmacro __using__(_opts) do
    quote do
      use Absinthe.Schema.Notation
      import Absinthe.Resolution.Helpers

      import unquote(__MODULE__)
    end
  end
end
