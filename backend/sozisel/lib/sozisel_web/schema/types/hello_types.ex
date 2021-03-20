defmodule SoziselWeb.Schema.Types.HelloTypes do
  use Absinthe.Schema.Notation

  object :hello_message do
    field :message, non_null(:string)
  end
end
