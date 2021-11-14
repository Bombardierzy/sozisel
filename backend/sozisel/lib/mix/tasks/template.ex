defmodule Mix.Tasks.Template do
  use Mix.Task

  # list of files that need to be evaluated with a new event
  @files_for_eval [
    "lib/sozisel/model/events/event.ex",
    "lib/sozisel/model/event_results/event_result.ex",
    "lib/sozisel_web/schema.ex",
    "lib/sozisel_web/schema/types/event_types.ex",
    "lib/sozisel_web/schema/types/event_result_types.ex"
  ]

  # mapping for files that needs to be generated and put
  # in their new directories
  @files_for_generation %{
    "templates/event_model.ex" => "lib/sozisel/model/<%= @event_name %>s/<%= @event_name %>.ex",
    "templates/event_result_model.ex" =>
      "lib/sozisel/model/<%= @event_name %>s/<%= @event_name %>_result.ex",
    "templates/event_types.ex" => "lib/sozisel_web/schema/types/<%= @event_name %>_types.ex",
    "templates/event_mutations.ex" =>
      "lib/sozisel_web/schema/mutations/<%= @event_name %>_mutations.ex"
  }

  @eval_prefix "# EVAL "
  @comma " #COMMA"

  @shortdoc "Generates a new module template"
  def run([event_name]) do
    unless String.match?(event_name, ~r/[a-z_]+/) do
      Mix.raise(
        "Event name should be all lower case letters separated by '_' when needed, got: '#{event_name}'"
      )
    end

    try do
      module = Macro.camelize(event_name)
      assigns = [module: module, event_name: event_name]

      {time, _} =
        :timer.tc(fn ->
          IO.puts("Generating files...")
          # generate all template files
          Enum.each(@files_for_generation, &generate_file(&1, assigns: assigns))

          IO.puts("Reevaluating existing files...")
          # evaluate all files for potential #EVAL prefixes
          Enum.each(@files_for_eval, &eval_file(&1, assigns: assigns))
        end)

      Mix.Task.run("format")

      IO.puts("Finished in #{time / 1_000_000}s")
    rescue
      e ->
        Mix.raise(e)
    end
  end

  defp generate_file({template_file, destination_file}, assigns) do
    content = EEx.eval_file(Path.join(base_project_path(), template_file), assigns)

    dest = Path.join(base_project_path(), EEx.eval_string(destination_file, assigns))

    IO.puts("> #{dest}")

    :ok = File.mkdir_p(Path.dirname(dest))

    File.write(dest, content)
  end

  defp eval_file(filename, assigns) do
    path = Path.join(base_project_path(), filename)

    IO.puts("> #{path}")

    content =
      path
      |> File.stream!()
      |> Enum.into([])
      |> Enum.map(fn line ->
        line =
          if replace_comma?(line) do
            String.replace(line, @comma, ", ")
          else
            line
          end

        if String.contains?(line, @eval_prefix) do
          [
            eval_line(line, assigns),
            line
          ]
        else
          line
        end
      end)
      |> List.flatten()
      |> Enum.join()

    File.write(path, content)
  end

  defp replace_comma?(line) do
    String.contains?(line, @comma) and not String.contains?(line, @eval_prefix)
  end

  defp eval_line(line, assigns) do
    line
    |> String.replace(@eval_prefix, "")
    |> EEx.eval_string(assigns)
  end

  defp base_project_path() do
    System.cmd("pwd", [])
    |> elem(0)
    |> String.trim()
  end
end
