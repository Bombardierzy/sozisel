defmodule Sozisel.VideoProcessor do
  use FFmpex.Options

  import FFmpex

  @doc """
  Expects a path to an mp4 file that will be transformed via ffmpeg with `faststart` option which makes
  the video seekable via content ranges when queried with http request.
  """
  @spec make_video_streamable(Path.t(), Path.t()) :: :ok | {:error, reason :: any()}
  def make_video_streamable(input_path, output_path) do
    FFmpex.new_command()
    |> add_input_file(input_path)
    |> add_output_file(output_path)
    |> add_file_option(option_c("copy"))
    |> add_file_option(option_movflags("faststart"))
    |> execute()
    |> case do
      :ok ->
        :ok

      {:error, {command_output, _exit_status}} ->
        {:error, command_output}
    end
  end
end
