defmodule Sozisel.JitsiTokenGenerator do
  @moduledoc """
  Module used for generating token used by Jitsi Meet to verify and display
  information about users.
  """

  @spec generate(String.t(), String.t(), String.t()) :: {:ok, String.t()}
  def generate(room_id, email, display_name) do
    config = Application.fetch_env!(:sozisel, __MODULE__)

    signer = Joken.Signer.create("HS256", Keyword.fetch!(config, :secret_key))
    iss = Keyword.fetch!(config, :issuer)

    token_config = %{
      "iss" => %Joken.Claim{
        generate: fn -> iss end,
        validate: fn val, _, _ -> val == iss end
      },
      "context" => %Joken.Claim{
        generate: fn ->
          %{
            "user" => %{
              "id" => Ecto.UUID.generate(),
              "name" => display_name,
              "email" => email
            }
          }
        end,
        validate: fn _val, _claims, _context -> true end
      },
      "room" => %Joken.Claim{
        generate: fn -> room_id end,
        validate: fn _, _, _ -> true end
      },
      "sub" => %Joken.Claim{
        generate: fn -> "*" end,
        validate: fn _, _, _ -> true end
      },
      "aud" => %Joken.Claim{
        generate: fn -> "jitsi" end,
        validate: fn val, _, _ -> val == "jitsi" end
      },
      "exp" => %Joken.Claim{
        generate: fn -> Joken.CurrentTime.OS.current_time() + 10 * 60 * 60 end,
        validate: fn _val, _claims, _context -> true end
      }
    }

    {:ok, claims} = Joken.generate_claims(token_config, %{})
    {:ok, jwt, _claims} = Joken.encode_and_sign(claims, signer)

    {:ok, jwt}
  end

  @spec decode(String.t()) :: {:ok, claims :: map()} | {:error, any()}
  def decode(token) do
    config = Application.fetch_env!(:sozisel, __MODULE__)

    signer = Joken.Signer.create("HS256", Keyword.fetch!(config, :secret_key))
    Joken.verify(token, signer)
  end
end
