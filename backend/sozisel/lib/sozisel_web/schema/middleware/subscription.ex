defmodule SoziselWeb.Schema.Middleware.Subscription do
  @moduledoc """
  Middleware behaviour for Absinthe's subscriptions.
  """

  @callback call(arguments :: map(), ctx :: map(), opts :: keyword()) ::
              {:ok, ctx :: map()} | {:error, any()}

  defmacro subscription_middleware(middleware, opts, config_fun) do
    quote do
      fn args, ctx ->
        with {:ok, ctx} <- unquote(middleware).call(args, ctx, unquote(opts)) do
          unquote(config_fun).(args, ctx)
        end
      end
    end
  end
end
