
defmodule Sozisel.Model.<%= @module %>s.<%= @module %>Result do
  use Sozisel.Model.Schema

  import Ecto.Changeset

  # This module should be responsible for defining
  # results to the generated event module.

  # TODO: implement me!
  @type t :: %__MODULE__{}

  # TODO: implement me!
  @primary_key false
  embedded_schema do
  end

  # TODO: implement me!
  def changeset(event_result, attrs) do
    event_result
    |> cast(attrs, [])
  end
end
