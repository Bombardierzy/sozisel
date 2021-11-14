defmodule SoziselWeb.Schema.Types.EventTypes do
  use SoziselWeb.Schema.Notation

  alias Sozisel.Model.Quizzes.Quiz
  alias Sozisel.Model.Polls.Poll
  alias Sozisel.Model.Whiteboards.Whiteboard
  # EVAL alias Sozisel.Model.<%= @module %>s.<%= @module %>

  object :event do
    field :id, non_null(:id)
    field :name, non_null(:string)
    field :duration_time_sec, non_null(:integer)
    field :start_minute, non_null(:integer)
    field :event_data, non_null(:event_data)

    field :session_template, non_null(:session_template) do
      resolve(dataloader(:db))
    end

    timestamps()
  end

  input_object :create_event_input_base do
    field :name, non_null(:string)
    field :duration_time_sec, non_null(:integer)
    field :start_minute, non_null(:integer)
    field :session_template_id, non_null(:id)
  end

  input_object :update_event_input_base do
    field :id, non_null(:id)
    field :name, :string
    field :duration_time_sec, :integer
    field :start_minute, :integer
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
    types [
      :quiz,
      :poll,
      :whiteboard #COMMA
      # EVAL :<%= @event_name %> #COMMA
    ]

    resolve_type fn
      %Quiz{}, _ -> :quiz
      %Poll{}, _ -> :poll
      %Whiteboard{}, _ -> :whiteboard
      # EVAL %<%= @module %>{}, _ -> :<%= @event_name %>
      _, _ -> nil
    end
  end

  union :participant_event_data do
    types [
      :participant_quiz,
      :poll,
      :whiteboard #COMMA
      # EVAL :<%= @event_name %> #COMMA
    ]

    resolve_type fn
      %Quiz{}, _ -> :participant_quiz
      %Poll{}, _ -> :poll
      %Whiteboard{}, _ -> :whiteboard
      # EVAL %<%= @module %>{}, _ -> :<%= @event_name %>
      _, _ -> nil
    end
  end

  object :participant_event do
    field :id, non_null(:id)
    field :name, non_null(:string)
    field :duration_time_sec, non_null(:integer)

    field :event_data, non_null(:participant_event_data)
  end

  enum :event_type do
    value(:quiz)
    value(:poll)
    value(:whiteboard)
    # EVAL value(:<%= @event_name %>)
  end
end
