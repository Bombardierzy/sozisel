defmodule SoziselWeb.Schema.Types.ParticipantTypes do
  use SoziselWeb.Schema.Notation

  object :participant do
    field :id, non_null(:id)
    field :full_name, non_null(:string)
    field :email, non_null(:string)
    field :session_id, non_null(:string)
  end

  object :join_participant_to_session do
    field :id, non_null(:id)
    field :session_id, non_null(:string)
    field :full_name, non_null(:string)
    field :email, non_null(:string)
    field :token, non_null(:string)
  end

  input_object :join_participant_to_session_input do
    field :session_id, non_null(:string)
    field :password, :string
    field :full_name, non_null(:string)
    field :email, non_null(:string)
  end
end
