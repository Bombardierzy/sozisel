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
end
