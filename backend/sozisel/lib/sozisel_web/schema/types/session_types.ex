defmodule SoziselWeb.Schema.Types.SessionTypes do
  use SoziselWeb.Schema.Notation

  object :session do
    field :id, non_null(:id)
    field :name, non_null(:string)
    field :entry_password, :string
    field :scheduled_start_time, non_null(:datetime)
    field :start_time, :datetime
    field :end_time, :datetime
    field :use_jitsi, non_null(:boolean)

    field :owner, non_null(:user) do
      resolve(dataloader(:db, :user))
    end

    field :session_template, non_null(:session_template) do
      resolve(dataloader(:db))
    end

    timestamps()
  end

  enum :session_status do
    value(:any)
    value(:scheduled)
    value(:in_progress)
    value(:ended)
  end

  input_object :search_sessions_input do
    field :status, non_null(:session_status)
    field :date_from, :datetime
    field :date_to, :datetime
    field :name, :string, default_value: ""
  end

  input_object :create_session_input do
    field :name, non_null(:string)
    field :scheduled_start_time, non_null(:datetime)
    field :use_jitsi, :boolean
    field :entry_password, :string
    field :session_template_id, non_null(:id)
  end

  input_object :update_session_input do
    field :id, non_null(:id)
    field :name, :string
    field :scheduled_start_time, :datetime
    field :use_jitsi, :boolean
    field :entry_password, :string
  end
end
