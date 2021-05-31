defmodule SoziselWeb.Schema.Middleware.Subscriptions.Participant do
  @behaviour SoziselWeb.Schema.Middleware.Subscription

  alias Sozisel.Model.{Participants, Participants.Participant, Sessions.Session}
  alias Sozisel.Repo

  @impl true
  def call(%{participant_token: token}, ctx, _opts) do
    with %Participant{} = participant <- Participants.find_by_token(token),
         %Participant{session: %Session{} = session} <- Repo.preload(participant, :session) do
      {:ok,
       update_in(ctx, [:context], fn context ->
         value = %{
           session_id: session.id,
           participant_id: participant.id
         }

         if is_map(context) do
           Map.merge(context, value)
         else
           value
         end
       end)}
    else
      _ ->
        {:error, "unauthorized"}
    end
  end
end
