[
  import_deps: [:ecto, :phoenix, :absinthe],
  inputs: ["*.{ex,exs}", "priv/*/seeds.exs", "{config,lib,test}/**/*.{ex,exs}"],
  subdirectories: ["priv/*/migrations"],
  locals_without_parens: [
    result: 1,
    result: 3,
    result: 4
  ]
]
