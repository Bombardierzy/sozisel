defmodule SoziselWeb.Schema.Queries.HelloQueries do
  use SoziselWeb.Schema.Notation

  object :hello_queries do
    field :hello, non_null(:hello_message) do
      resolve(fn _parent, _args, _context ->
        {:ok, %{message: "Hello there!"}}
      end)
    end
  end
end
