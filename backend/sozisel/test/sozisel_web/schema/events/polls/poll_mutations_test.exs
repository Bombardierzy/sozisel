defmodule SoziselWeb.Schema.Events.Polls.PollMutationsTest do
  use SoziselWeb.AbsintheCase

  import Sozisel.Factory

  alias Sozisel.Model.Events.Event

  @create_poll """
  mutation CreatePoll($input: CreatePollInput!) {
    createPoll(input: $input) {
      id
      name
      durationTimeSec
      startMinute
      eventData {
        ... on Poll {
          question
          isMultiChoice
          options {
            id
            text
          }
        }
      }
      sessionTemplate {
        id
      }
    }
  }
  """

  @update_poll """
  mutation UpdatePoll($input: UpdatePollInput!) {
    updatePoll(input: $input) {
      id
      name
      durationTimeSec
      startMinute
      eventData {
        ... on Poll {
          question
          isMultiChoice
          options {
            id
            text
          }
        }
      }
    }
  }
  """

  @delete_poll """
  mutation DeletePoll($id: ID!) {
    deleteEvent(id: $id) {
      id
      name
    }
  }
  """

  @valid_attrs_for_poll_event %{
    name: "some poll",
    duration_time_sec: 12,
    startMinute: 10,
    eventData: %{
      question: "How are you today?",
      isMultiChoice: false,
      options: [
        %{id: "1", text: "well"},
        %{id: "2", text: "not well"}
      ]
    }
  }

  @valid_attrs_for_update_poll_event %{
    name: "some poll",
    duration_time_sec: 12,
    startMinute: 10,
    eventData: %{
      question: "what",
      isMultiChoice: true,
      options: [
        %{id: "1", text: "nothing"},
        %{id: "2", text: "something"},
        %{id: "3", text: "essa"}
      ]
    }
  }

  describe "Poll mutations should" do
    setup do
      user = insert(:user)
      template = insert(:template, user_id: user.id)
      [conn: test_conn(user), user: user, template: template]
    end

    test "create a new poll", ctx do
      valid_attrs = Map.put(@valid_attrs_for_poll_event, :session_template_id, ctx.template.id)

      variables = %{
        input: valid_attrs
      }

      session_template_id = ctx.template.id

      assert %{
               data: %{
                 "createPoll" => %{
                   "id" => _,
                   "name" => "some poll",
                   "startMinute" => 10,
                   "eventData" => %{
                     "question" => "How are you today?",
                     "options" => options,
                     "isMultiChoice" => false
                   },
                   "sessionTemplate" => %{
                     "id" => ^session_template_id
                   }
                 }
               }
             } = run_query(ctx.conn, @create_poll, variables)

      assert length(options) == 2
    end

    test "update an existing poll", ctx do
      poll = insert(:poll_event, session_template_id: ctx.template.id)

      valid_attrs = Map.put(@valid_attrs_for_update_poll_event, :id, poll.id)

      variables = %{
        input: valid_attrs
      }

      assert %{
               data: %{
                 "updatePoll" => %{
                   "id" => _,
                   "name" => _,
                   "eventData" => %{
                     "question" => "what",
                     "options" => [
                       %{"id" => "1", "text" => "nothing"},
                       %{"id" => "2", "text" => "something"},
                       %{"id" => "3", "text" => "essa"}
                     ]
                   }
                 }
               }
             } = run_query(ctx.conn, @update_poll, variables)
    end

    test "soft delete an existing poll event", ctx do
      %{
        id: poll_id,
        name: poll_name
      } = insert(:poll_event, session_template_id: ctx.template.id)

      variables = %{
        id: poll_id
      }

      assert %{
               data: %{
                 "deleteEvent" => %{
                   "id" => ^poll_id,
                   "name" => ^poll_name
                 }
               }
             } = run_query(ctx.conn, @delete_poll, variables)

      assert Repo.get(Event, poll_id) == nil
    end

    test "forbid create poll event by unauthorized user", ctx do
      valid_attrs = Map.put(@valid_attrs_for_poll_event, :session_template_id, ctx.template.id)

      variables = %{
        input: valid_attrs
      }

      assert %{
               data: %{
                 "createPoll" => nil
               },
               errors: [%{"message" => "unauthorized"}]
             } = run_query(test_conn(), @create_poll, variables)
    end

    test "forbid update/delete poll event by non-owner", ctx do
      poll = insert(:poll_event, session_template_id: ctx.template.id)

      other_user = insert(:user)
      other_conn = test_conn(other_user)

      valid_attrs = Map.put(@valid_attrs_for_update_poll_event, :id, poll.id)

      variables = %{
        input: valid_attrs
      }

      assert %{errors: [%{"message" => "unauthorized"}]} =
               run_query(other_conn, @update_poll, variables)

      variables = %{
        id: poll.id
      }

      assert %{errors: [%{"message" => "unauthorized"}]} =
               run_query(other_conn, @delete_poll, variables)
    end
  end
end
