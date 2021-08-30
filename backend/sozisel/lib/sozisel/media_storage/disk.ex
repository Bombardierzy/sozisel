defmodule Sozisel.MediaStorage.Disk do
  @behaviour Sozisel.MediaStorage

  @impl true
  def store_file(filename, temporary_path) do
    File.rename(temporary_path, full_file_path(filename))
  end

  @impl true
  def remove_file(filename) do
    filename
    |> full_file_path()
    |> File.rm()
  end

  @impl true
  def file_exists?(filename) do
    filename
    |> full_file_path()
    |> File.exists?()
  end

  @impl true
  def file_size(filename) do
    filename
    |> full_file_path()
    |> File.stat(filename)
    |> case do
      %File.Stat{size: size} -> size
      {:error, _reason} -> 0
    end
  end

  defp full_file_path(filename) do
    Path.join([
      Application.fetch_env!(:sozisel, SoziselWeb.Recordings) |> Keyword.fetch!(:upload_path),
      filename
    ])
  end
end
