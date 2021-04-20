defmodule SoziselWeb.Schema.Types.SessionTypes do
  use SoziselWeb.Schema.Notation

  object :session do
    field :id, non_null(:id)
    field :name, non_null(:string)
    field :entry_password, :string
    field :start_time, non_null(:integer)
    field :use_jitsi, non_null(:boolean)

    field :owner, non_null(:user) do
      resolve(dataloader(:db, :user))
    end

    field :session_template, non_null(:session_template) do
      resolve(dataloader(:db))
    end

    timestamps()
  end
end
