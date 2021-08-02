defmodule SoziselWeb.Schema.Types.EventResultTypes do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.Quizzes.QuizResult
  alias Sozisel.Model.Polls.PollResult

  object :event_result do
    field :id, non_null(:id)

    field :participant, non_null(:participant) do
      resolve(dataloader(:db))
    end

    field :launched_event, non_null(:launched_event) do
      resolve(dataloader(:db))
    end

    field :result_data, non_null(:event_result_data)
  end

  union :event_result_data do
    types [:quiz_result, :poll_result]

    resolve_type fn
      %QuizResult{}, _ -> :quiz_result
      %PollResult{}, _ -> :poll_result
      _, _ -> nil
    end
  end
end
