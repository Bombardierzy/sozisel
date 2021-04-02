defmodule Sozisel.Model.Users.Token do
  use Guardian, otp_app: :sozisel

  alias Sozisel.Model.{Users, Users.User}

  @doc """
  Generates a jwt token given user struct.
  """
  @spec generate(User.t()) :: String.t()
  def generate(user) do
    {:ok, token, _claims} = __MODULE__.encode_and_sign(user)

    token
  end

  @doc """
  Given jwt token retrieves user if token is still valid.
  """
  @spec retrieve_user(String.t()) :: {:ok, User.t()} | {:error, :invalid_token}
  def retrieve_user(token) do
    with {:ok, user, _claims} <- __MODULE__.resource_from_token(token) do
      {:ok, user}
    else
      _ ->
        {:error, :invalid_token}
    end
  end

  @impl true
  def subject_for_token(%User{id: user_id}, _claims) do
    {:ok, user_id}
  end

  @impl true
  def subject_for_token(_, _) do
    {:error, :invalid_resource}
  end

  @impl true
  def resource_from_claims(%{"sub" => user_id}) do
    case Users.get_user(user_id) do
      nil ->
        {:error, :user_not_found}

      %User{} = user ->
        {:ok, user}
    end
  end

  @impl true
  def resource_from_claims(_claims) do
    {:error, :invalid_claims}
  end
end
