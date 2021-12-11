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
    field :summary_note, :string

    field :owner, non_null(:user) do
      resolve(dataloader(:db, :user))
    end

    field :session_template, non_null(:session_template) do
      resolve(dataloader(:db))
    end

    field :launched_events, strong_list_of(:launched_event) do
      resolve(dataloader(:db))
    end

    field :session_recording, :session_recording do
      resolve(dataloader(:db))
    end

    timestamps()
  end

  object :session_thumbnail do
    field :id, non_null(:id)
    field :name, non_null(:string)
    field :scheduled_start_time, non_null(:datetime)
    field :start_time, :datetime
    field :estimated_time, non_null(:integer)
    field :password_required, non_null(:boolean)
    field :use_jitsi, non_null(:boolean)
    field :agenda_entries, strong_list_of(:agenda_entry)
    field :session_ended, non_null(:boolean)

    field :owner, non_null(:user) do
      resolve(dataloader(:db, :user))
    end
  end

  @desc "Current session status"
  enum :session_status do
    @desc "Any status."
    value(:any)

    @desc """
    Sessions is said to be scheduled if has not been yet started.
    """
    value(:scheduled)

    @desc """
    Session is currently in progress (startTime is set and endTime is null)
    """
    value(:in_progress)

    @desc """
    Session has ended.
    """
    value(:ended)
  end

  object :event_participation do
    field :launched_event_id, non_null(:id)
    field :event_id, non_null(:id)
    field :event_name, non_null(:string)
    field :submissions, non_null(:integer)
    field :start_minute, non_null(:integer)
    field :event_type, non_null(:event_type)
  end

  object :session_summary do
    @desc "Total number of participants that has attended the session"
    field :total_participants, non_null(:integer)

    @desc "Session duration time in minutes"
    field :duration_time, non_null(:integer)

    @desc "Total number of submitted event results"
    field :total_submissions, non_null(:integer)

    @desc "List representing all events participations statistics (number of participants that has submitted a result)"
    field :event_participations, strong_list_of(:event_participation)
  end

  enum :session_info do
    value :session_end, description: "Session has been ended"
  end

  object :session_notification_info do
    field :info, non_null(:session_info)
  end

  input_object :search_sessions_input do
    field :status, non_null(:session_status)
    field :date_from, :datetime
    field :date_to, :datetime
    field :name, :string, default_value: ""
    field :template_id, :id
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
    field :summary_note, :string
  end
end
