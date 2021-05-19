defmodule SoziselWeb.Schema.Types.SessionTemplateTypes do
  use SoziselWeb.Schema.Notation

  object :session_template do
    field :id, non_null(:id)
    field :name, non_null(:string)
    field :estimated_time, non_null(:integer)
    field :is_public, non_null(:boolean)
    field :deleted_at, :datetime

    field :owner, non_null(:user) do
      resolve(dataloader(:db, :user))
    end

    field :agenda_entries, strong_list_of(:agenda_entry) do
      resolve(dataloader(:db))
    end

    field :events, strong_list_of(:event) do
      resolve(dataloader(:db))
    end

    timestamps()
  end

  object :agenda_entry do
    field :id, non_null(:id)
    field :name, non_null(:string)
    field :start_minute, non_null(:integer)

    timestamps()
  end

  input_object :agenda_entry_input do
    field :name, non_null(:string)
    field :start_minute, non_null(:integer)
  end

  input_object :create_session_template_input do
    field :name, non_null(:string)
    field :estimated_time, non_null(:integer)
    field :is_public, non_null(:boolean)
    field :agenda_entries, strong_list_of(:agenda_entry_input)
  end

  input_object :update_session_template_input do
    field :id, non_null(:id)
    field :name, :string
    field :estimated_time, :integer
    field :is_public, :boolean
    field :agenda_entries, list_of(non_null(:agenda_entry_input))
  end
end
