defmodule SoziselWeb.Schema.Types.UserTypes do
  use SoziselWeb.Schema.Notation

  object :user do
    field :id, non_null(:id)
    field :email, non_null(:string)
    field :first_name, non_null(:string)
    field :last_name, non_null(:string)
  end

  object :me do
    import_fields(:user)

    field :session_resources, strong_list_of(:session_resource) do
      resolve dataloader(:db)
    end

    field :session_templates, strong_list_of(:session_template) do
      resolve dataloader(:db)
    end
  end

  object :jitsi_token do
    field :token, non_null(:string)
    field :email, non_null(:string)
    field :display_name, non_null(:string)
  end

  object :login_result do
    field :token, non_null(:string)
  end

  input_object :register_input do
    field :email, non_null(:string)
    field :first_name, non_null(:string)
    field :last_name, non_null(:string)
    field :password, non_null(:string)
  end

  input_object :login_input do
    field :email, non_null(:string)
    field :password, non_null(:string)
  end
end
