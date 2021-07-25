defmodule SoziselWeb.Schema.Types.EventTypes do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.Quizzes.Quiz
  alias Sozisel.Model.Polls.Poll

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

  object :launched_event do
    field :id, non_null(:id)

    field :session, non_null(:session) do
      resolve(dataloader(:db))
    end

    field :event, non_null(:event) do
      resolve(dataloader(:db))
    end

    field :event_results, strong_list_of(:event_result) do
      resolve(dataloader(:db))
    end

    timestamps()
  end

  union :event_data do
    types [:quiz, :poll]

    resolve_type fn
      %Quiz{}, _ -> :quiz
      %Poll{}, _ -> :poll
      _, _ -> nil
    end
  end

  union :participant_event_data do
    types [:participant_quiz, :poll]

    resolve_type fn
      %Quiz{}, _ -> :participant_quiz
      %Poll{}, _ -> :poll
      _, _ -> nil
    end
  end

  object :participant_event do
    field :id, non_null(:id)
    field :name, non_null(:string)

    field :event_data, non_null(:participant_event_data)
  end
end
