defmodule Sozisel.Model.Polls.Poll do
  use Sozisel.Model.Schema
  import Ecto.Changeset

  defmodule PollOption do
    use Sozisel.Model.Schema

    @type t :: %__MODULE__{
            option_id: String.t(),
            text: String.t()
          }

    @primary_key false
    embedded_schema do
      field :option_id, :string
      field :text, :string
    end
  end

  @type t :: %__MODULE__{
          options: [PollOption.t()]
        }

  @primary_key false
  embedded_schema do
    embeds_many :options, PollOption, on_replace: :delete
  end

  def changeset(schema, attrs) do
    schema
    |> cast(attrs, [])
    |> cast_embed([:options])
  end
end
