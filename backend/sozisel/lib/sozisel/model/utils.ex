defmodule Sozisel.Model.Utils do
  @doc """
  This module contains function of general utility
  """

  def escape_wildcards(string) do
    string
    |> String.replace("\\", "\\\\")
    |> String.replace("%", "\\%")
    |> String.replace("_", "\\_")
  end

  @doc """
  Traverses given data structure and converts all structs to maps.
  """
  def from_deep_struct(%{} = map), do: convert(map)

  defp convert(data) when is_struct(data) do
    data |> Map.from_struct() |> convert()
  end

  defp convert(data) when is_map(data) do
    for {key, value} <- data, reduce: %{} do
      acc ->
        case key do
          :__meta__ ->
            acc

          other ->
            Map.put(acc, other, convert(value))
        end
    end
  end

  defp convert(data) when is_list(data) do
    data
    |> Enum.map(fn elem -> convert(elem) end)
  end

  defp convert(other), do: other
end
