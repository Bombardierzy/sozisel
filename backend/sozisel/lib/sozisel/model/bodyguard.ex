defmodule Sozisel.Model.Bodyguard do
  @moduledoc """
  Module that should be used for checking if user is authorized to perform certain operations.


  *WARNING* Should not be used with queries as it can introduce N+1 problem.
  """
  @behaviour Bodyguard.Policy

  alias Sozisel.Model.{Events.Event, Sessions, Sessions.Session, Sessions.Template, Users.User}

  @unauthorized {:error, "unauthorized"}

  # Sessions
  @impl true
  def authorize(:query_session, %User{id: user_id}, %Session{user_id: user_id}), do: :ok
  def authorize(:update_session, %User{id: user_id}, %Session{user_id: user_id}), do: :ok
  def authorize(:delete_session, %User{id: user_id}, %Session{user_id: user_id}), do: :ok
  def authorize(:start_session, %User{id: user_id}, %Session{user_id: user_id}), do: :ok
  def authorize(:end_session, %User{id: user_id}, %Session{user_id: user_id}), do: :ok

  def authorize(:upload_session_recording, %User{id: user_id}, %Session{user_id: user_id}),
    do: :ok

  # Session templates
  def authorize(:update_session_template, %User{id: user_id}, %Template{user_id: user_id}),
    do: :ok

  def authorize(:delete_session_template, %User{id: user_id}, %Template{user_id: user_id}),
    do: :ok

  def authorize(:clone_session_template, %User{}, %Template{is_public: true}), do: :ok

  def authorize(:clone_session_template, %User{id: user_id}, %Template{
        user_id: user_id,
        is_public: false
      }),
      do: :ok

  # Events
  def authorize(:create_event, %User{id: user_id}, %Template{user_id: user_id}), do: :ok

  def authorize(:query_event, %User{id: user_id}, %Event{
        session_template_id: session_template_id
      }),
      do: Sessions.is_template_owner(session_template_id, user_id) |> handle_result()

  def authorize(:update_event, %User{id: user_id}, %Event{
        session_template_id: session_template_id
      }),
      do: Sessions.is_template_owner(session_template_id, user_id) |> handle_result()

  def authorize(:delete_event, %User{id: user_id}, %Event{
        session_template_id: session_template_id
      }),
      do: Sessions.is_template_owner(session_template_id, user_id) |> handle_result()

  def authorize(_, _, _), do: @unauthorized

  defp handle_result(true), do: :ok
  defp handle_result(_), do: @unauthorized
end
