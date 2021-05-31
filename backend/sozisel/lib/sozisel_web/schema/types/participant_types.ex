defmodule SoziselWeb.Schema.Types.ParticipantTypes do
  use SoziselWeb.Schema.Notation

  object :participant do
    field :id, non_null(:id)
    field :full_name, non_null(:string)
    field :email, non_null(:string)
    field :session_id, non_null(:string)
  end
end
