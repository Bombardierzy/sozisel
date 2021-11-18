ignore_paths = [
  "lib/sozisel/model/events/event.ex",
  "lib/sozisel/model/event_results/event_result.ex",
  "lib/sozisel_web/schema/types/event_types.ex",
  "lib/sozisel_web/schema/types/event_result_types.ex"
]

[
  import_deps: [:ecto, :phoenix, :absinthe],
  # inputs: ["*.{ex,exs}", "priv/*/seeds.exs", "{config,lib,test}/**/*.{ex,exs}"],
  inputs:
    Enum.flat_map(
      ["{mix,.formatter}.exs", "{config,lib,test}/**/*.{ex,exs}"],
      &Path.wildcard(&1, match_dot: true)
    ) -- ignore_paths,
  subdirectories: ["priv/*/migrations"],
  locals_without_parens: [
    result: 1,
    result: 3,
    result: 4
  ]
]
