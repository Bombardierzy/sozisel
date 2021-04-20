defmodule SoziselWeb.Dataloader do
  import Ecto.Query

  alias Sozisel.Repo
  alias Sozisel.Model.Sessions.Template

  def new() do
    Dataloader.new()
    |> Dataloader.add_source(:db, data())
  end

  defp data() do
    Dataloader.Ecto.new(Repo, query: &query/2)
  end

  defp query(Template, _), do: from(p in Template, where: is_nil(p.deleted_at))

  defp query(queryable, _params) do
    queryable
  end
end
