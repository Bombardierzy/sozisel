defmodule SoziselWeb.Schema.Types.EventResultTypes do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Repo
  alias Sozisel.Model.EventResults.EventResult
  alias Sozisel.Model.Quizzes.QuizResult
  alias Sozisel.Model.Polls.PollResult
  alias Sozisel.Model.Whiteboards.WhiteboardResult
  # EVAL alias Sozisel.Model.<%= @module %>s.<%= @module %>Result

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
    types [
      :quiz_result,
      :poll_result,
      :whiteboard_result #COMMA
      # EVAL :<%= @event_name %>_result #COMMA
    ]

    resolve_type fn
      %QuizResult{}, _ -> :quiz_result
      %PollResult{}, _ -> :poll_result
      %WhiteboardResult{}, _ -> :whiteboard_result
      # EVAL %<%= @module %>Result{}, _ -> :<%= @event_name %>_result
      _, _ -> nil
    end
  end

  @desc """
  Type used for presenter's live results subscription. Has no real representation in database (most of the time).

  Should not be used outside of subscription as it does not support dataloader.

  `PresenterEventResultData` is simplified on purpose to reduce computations necessary on frontend side.
  """
  object :presenter_event_result do
    @desc "ID of underlying event result"
    field :id, non_null(:id)

    field :participant, non_null(:participant) do
      resolve fn _, %{source: %{id: event_result_id}} ->
        event_result_assoc(event_result_id, :participant)
      end
    end

    field :launched_event, non_null(:launched_event) do
      resolve fn _, %{source: %{id: event_result_id}} ->
        event_result_assoc(event_result_id, :launched_event)
      end
    end

    field :result_data, non_null(:presenter_event_result_data)
  end

  union :presenter_event_result_data do
    types [
      :quiz_simple_result,
      :poll_result,
      :whiteboard_result #COMMA
      # EVAL :<%= @event_name %>_result #COMMA
    ]

    resolve_type fn
      %{total_points: _}, _ -> :quiz_simple_result
      %PollResult{}, _ -> :poll_result
      %WhiteboardResult{}, _ -> :whiteboard_result
      # EVAL %<%= @module %>Result{}, _ -> :<%= @event_name %>_result
      _, _ -> nil
    end
  end

  defp event_result_assoc(id, type) when type in [:participant, :launched_event] do
    EventResult
    |> Repo.get(id)
    |> Ecto.assoc(type)
    |> Repo.one()
    |> then(&{:ok, &1})
  end
end
