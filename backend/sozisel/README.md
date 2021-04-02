# Sozisel

Before you start make sure you have database instance running.

To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.setup`
  * Start Phoenix endpoint with `mix phx.server`

To access GraphQL API visit `/api` endpoint and for playground use `/api/graphiql`.


## Creating new models

Generating new models and schemas can be troublesome but phoenix framework makes it a little bit less tedious.

Phoenix allows you to create something called `Context`. To make it quick, it does a bunch of things:
- generate a database migration
- creates Ecto schema
- creates a file with utilities like: create/update

**IMPORTANT**

Contexts are being generated inside `sozisel` folder which can get quite large therefore
move generated contexts to `model` subfolder and add `Model` name module names.

On how to generate a new context please go [here](https://hexdocs.pm/phoenix/contexts.html).
