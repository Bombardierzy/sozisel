defmodule SoziselWeb.Schema.Middleware.ChangesetErrorTranslator do
  @moduledoc """
  Mirror functionality of `Crudry.Middlewares.TranslateErrors` but adds support for `PolymorphicEmbed`.
  """

  @behaviour Absinthe.Middleware

  alias Crudry.Translator
  alias Absinthe.Resolution

  def call(%{errors: errors} = resolution, _config) do
    translator = get_translator(resolution)
    locale = get_locale(resolution, translator)

    Resolution.put_result(
      resolution,
      {:error, Enum.flat_map(errors, &handle_error(&1, translator, locale))}
    )
  end

  defp get_translator(%{context: %{translator: translator}}), do: translator
  defp get_translator(_res), do: Translator

  defp get_locale(%{context: %{locale: locale}}, _translator), do: locale
  defp get_locale(_res, translator), do: Gettext.get_locale(translator)

  def handle_error(%Ecto.Changeset{} = changeset, translator, locale) do
    changeset
    |> Sozisel.Model.ChangesetErrorTraverser.traverse_errors(
      &translate_error(&1, translator, locale)
    )
    |> Enum.map(fn {key, value} -> message_to_string(key, value, translator, locale) end)
    |> List.flatten()
  end

  def handle_error(%{message: message, schema: schema}, translator, locale) do
    translated_message = translate_with_domain(translator, locale, :errors_domain, message)

    schema
    |> message_to_string([translated_message], translator, locale)
    |> List.wrap()
  end

  def handle_error(error, translator, locale) when is_binary(error) do
    translator
    |> translate_with_domain(locale, :errors_domain, error)
    |> List.wrap()
  end

  # If it's a map, a number or a keyword list, we don't try to translate
  def handle_error(error, _translator, _locale) do
    List.wrap(error)
  end

  defp translate_with_domain(translator, locale, domain, msgid, bindings \\ %{}) do
    Gettext.with_locale(locale, fn ->
      Gettext.dgettext(translator, get_domain(translator, domain), msgid, bindings)
    end)
  end

  # The error message is a tuple like this:
  # {"should be at least %{count} characters", [count: 3, validation: :length, min: 3]}
  # So here we translate it to become like this:
  # "should be at least 3 characters"
  defp translate_error({error, opts}, translator, locale) do
    translate_with_domain(translator, locale, :errors_domain, error, opts)
  end

  defp get_domain(translator, domain) do
    try do
      apply(translator, domain, [])
    rescue
      _error -> apply(Translator, domain, [])
    end
  end

  # Simple case (e.g. key: `label`, value: `"does not exist"`)
  # Just concatenate strings
  defp message_to_string(key, [value], translator, locale) when is_binary(value) do
    translated_field = translate_with_domain(translator, locale, :schemas_domain, to_string(key))

    "#{translated_field} #{value}"
  end

  # Nested case, like this:
  # %{project_workflow_steps: [%{map: %{definition: ["cant be blank"]}}, %{}]}
  # key: `project_workflow_steps`, value: `[%{map: %{definition: ["cant be blank"]}}, %{}]`
  # Remove empty maps and recursively convert nested messages to string
  defp message_to_string(key, value, translator, locale) when is_list(value) do
    value
    |> Enum.reject(fn x -> x == %{} end)
    |> Enum.map(fn
      string when is_binary(string) ->
        message_to_string(key, [string], translator, locale)

      enumerable when is_list(enumerable) or is_map(enumerable) ->
        Enum.map(enumerable, fn {inner_key, inner_value} ->
          message_to_string(key, Map.new([{inner_key, inner_value}]), translator, locale)
        end)
    end)
  end

  # When there are no more nested errors, the input is
  # key: `map`, value: `%{definition: ["cant be blank"]}`
  # Only add `key: ` to the start of the string if this is the last level of nesting.
  defp message_to_string(key, %{} = value, translator, locale) do
    translated_key = translate_with_domain(translator, locale, :schemas_domain, to_string(key))

    Enum.map(value, fn {inner_key, inner_value} ->
      translated_inner_value = message_to_string(inner_key, inner_value, translator, locale)

      case get_value(inner_value) do
        %{} -> translated_inner_value
        _ -> "#{translated_key}: #{translated_inner_value}"
      end
    end)
  end

  defp get_value(%{} = value), do: value
  defp get_value(value), do: List.first(value)
end
