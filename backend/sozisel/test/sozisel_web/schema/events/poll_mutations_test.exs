defmodule SoziselWeb.Schema.Events.PollMutationsTest do
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
    deletePoll(id: $id) {
      id
      name
    }
  }
  """
  describe "Quiz mutations should" do
    setup do
      user = insert(:user)
      template = insert(:template, user_id: user.id)
      session = insert(:session, session_template_id: template.id, user_id: user.id)
      [conn: test_conn(user), user: user, template: template, session: session]
    end

    test "create a new poll", ctx do
      variables = %{
        input: %{
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
          },
          sessionTemplateId: ctx.template.id
        }
      }

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
                     "id" => _
                   }
                 }
               }
             } = run_query(ctx.conn, @create_poll, variables)

      assert length(options) == 2
    end

    test "update an existing poll", ctx do
      poll = insert(:poll_event, session_template_id: ctx.template.id)

      variables = %{
        input: %{
          id: poll.id,
          eventData: %{
            question: "what",
            isMultiChoice: true,
            options: [
              %{id: "1", text: "nothing"},
              %{id: "2", text: "something"}
            ]
          }
        }
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
                       %{"id" => "2", "text" => "something"}
                     ]
                   }
                 }
               }
             } = run_query(ctx.conn, @update_poll, variables)
    end

    test "delete poll", ctx do
      %{id: poll_id} = insert(:poll_event, session_template_id: ctx.template.id)

      variables = %{
        id: poll_id
      }

      assert %{
               data: %{
                 "deletePoll" => %{
                   "id" => ^poll_id
                 }
               }
             } = run_query(ctx.conn, @delete_poll, variables)

      assert Repo.get(Event, poll_id) == nil
    end
  end
end
