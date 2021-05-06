defmodule SoziselWeb.Schema.SessionQueriesTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  @search_sessions """
  query SearchSessions {
    searchSessions {
      id
      name
      estimatedTime
      isPublic
      owner {
        id
      }
      agendaEntries {
        id
        name
        startMinute
      }
    }
  }
  """

  describe "Sessions' search query should" do
    setup do
      user = insert(:user)
      [conn: test_conn(user), user: user]
    end
  end
end
