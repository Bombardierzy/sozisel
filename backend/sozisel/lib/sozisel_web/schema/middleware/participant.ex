defmodule SoziselWeb.Schema.Middleware.Participant do
  @moduledoc """
  A middleware for authorizing session participants.

  It checks for a token field in arguments map and based on that tries to fetch corresponding participant.
  If participant is not found then it returns  `unauthorized` error, otherwise two entries are added to resolution context:
  * - `participant`
  * - `session`
  """

  @behaviour Absinthe.Middleware

  @unauthorized {:error, :unauthorized}

  alias Sozisel.Repo
  alias Sozisel.Model.{Participants, Participants.Participant, Sessions.Session}

  require Logger

  @impl true
  def call(%{arguments: %{token: token}} = resolution, _params) do
    with %Participant{} = participant <- Participants.find_by_token(token),
         %Participant{session: %Session{}} = participant <- Repo.preload(participant, :session) do
      context_part = %{
        session: participant.session,
        participant: %{participant | session: %Ecto.Association.NotLoaded{}}
      }

      %{resolution | context: Map.merge(resolution.context, context_part)}
    else
      _ ->
        Absinthe.Resolution.put_result(resolution, @unauthorized)
    end
  end

  def call(resolution, _params) do
    Logger.warn("""
    Participant middleware has been called on a resolution that has no `token` argument.
    Make sure that you schema is valid and declares `token` argument along with other necessary input arguments.
    """)

    Absinthe.Resolution.put_result(resolution, @unauthorized)
  end
end
