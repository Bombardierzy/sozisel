defmodule SoziselWeb.Schema.Types.EventTypes do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.Quizzes.Quiz

  object :event do
    field :id, non_null(:id)
    field :name, non_null(:string)
    field :start_minute, non_null(:integer)
    field :event_structure, non_null(:event_structure)
    field :session_template_id, non_null(:string)

    timestamps()
  end

  union :event_structure do
    types [:quiz]

    resolve_type fn
      %Quiz{}, _ -> :quiz
      _, _ -> nil
    end
  end
end
