defmodule SoziselWeb.Schema.Types.EventTypes do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.Quizzes.Quiz

  object :event do
    field :id, non_null(:id)
    field :name, non_null(:string)
    field :start_minute, non_null(:integer)
    field :event_data, non_null(:event_data)

    field :session_template, non_null(:session_template) do
      resolve(dataloader(:db))
    end

    timestamps()
  end

  union :event_data do
    types [:quiz]

    resolve_type fn
      %Quiz{}, _ -> :quiz
      _, _ -> nil
    end
  end
end
