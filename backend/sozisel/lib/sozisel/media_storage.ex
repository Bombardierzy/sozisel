defmodule Sozisel.MediaStorage do
  @moduledoc """
  Behaviour for storing media files and obtaining
  information for existing files.
  """

  @doc """
  Stores file under filename identifier. The file should be accessible under the same identifier.
  """
  @callback store_file(filename :: String.t(), temporary_path :: Path.t()) ::
              :ok | {:error, reason :: any()}

  @doc """
  Removes file with given filename identifer.
  """
  @callback remove_file(filename :: String.t()) :: :ok | {:error, any()}

  @doc """
  Check if file with given filename identifier exists.
  """
  @callback file_exists?(filename :: String.t()) :: boolean()

  @doc """
  Returns size in bytes for given filename identifier. Should return 0 if no such file exists.
  """
  @callback file_size(filename :: String.t()) :: non_neg_integer()
end
