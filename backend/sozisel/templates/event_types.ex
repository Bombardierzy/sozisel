defmodule SoziselWeb.Schema.Types.<%= @module %>Types do
  use SoziselWeb.Schema.Notation

  object :<%= @event_name %> do
    # TODO: implement me!
  end

  input_object :<%= @event_name %>_input do
    # TODO: implement me!
  end

  input_object :create_<%= @event_name %>_input do
    import_fields :create_event_input_base

    field :event_data, non_null(:<%= @event_name %>_input)
  end

  input_object :update_<%= @event_name %>_input do
    import_fields :update_event_input_base

    field :event_data, non_null(:<%= @event_name %>_input)
  end

  object :<%= @event_name %>_result do
    # TODO: implement me!
  end

  input_object :<%= @event_name %>_result_input do
    field :launched_event_id, non_null(:id)

    # TODO: implement me!
  end
end
