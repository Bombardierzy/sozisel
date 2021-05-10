defmodule Sozisel.Model.ChangesetErrorTraverser do
  @moduledoc """
  A mirror functionality of `Ecto.Changeset` but adds support for traversing errors that include `PolymorphicEmbed`.
  """

  alias Ecto.Changeset
  @relations [:embed, :assoc]
  @type error :: any()

  @spec traverse_errors(
          Changeset.t(),
          (error -> String.t()) | (Changeset.t(), atom, error -> String.t())
        ) :: %{atom => [String.t() | map]}
  def traverse_errors(
        %Changeset{errors: errors, changes: changes, types: types} = changeset,
        msg_func
      )
      when is_function(msg_func, 1) or is_function(msg_func, 3) do
    errors
    |> Enum.reverse()
    |> merge_error_keys(msg_func, changeset)
    |> merge_related_keys(changes, types, msg_func)
  end

  defp merge_error_keys(errors, msg_func, _) when is_function(msg_func, 1) do
    Enum.reduce(errors, %{}, fn {key, val}, acc ->
      val = msg_func.(val)
      Map.update(acc, key, [val], &[val | &1])
    end)
  end

  defp merge_error_keys(errors, msg_func, changeset) when is_function(msg_func, 3) do
    Enum.reduce(errors, %{}, fn {key, val}, acc ->
      val = msg_func.(changeset, key, val)
      Map.update(acc, key, [val], &[val | &1])
    end)
  end

  defp merge_related_keys(_, _, nil, _) do
    raise ArgumentError, "changeset does not have types information"
  end

  defp merge_related_keys(map, changes, types, msg_func) do
    Enum.reduce(types, map, fn
      {field, {tag, %{cardinality: :many}}}, acc when tag in @relations ->
        if changesets = Map.get(changes, field) do
          {errors, all_empty?} =
            Enum.map_reduce(changesets, true, fn changeset, all_empty? ->
              errors = traverse_errors(changeset, msg_func)
              {errors, all_empty? and errors == %{}}
            end)

          case all_empty? do
            true -> acc
            false -> Map.put(acc, field, errors)
          end
        else
          acc
        end

      {field, {tag, %{cardinality: :one}}}, acc when tag in @relations ->
        if changeset = Map.get(changes, field) do
          case traverse_errors(changeset, msg_func) do
            errors when errors == %{} -> acc
            errors -> Map.put(acc, field, errors)
          end
        else
          acc
        end

      {field, {:parameterized, PolymorphicEmbed, _metadata}}, acc ->
        if changeset = Map.get(changes, field) do
          case traverse_errors(changeset, msg_func) do
            errors when errors == %{} -> acc
            errors -> Map.put(acc, field, errors)
          end
        else
          acc
        end

      {_, _}, acc ->
        acc
    end)
  end
end
