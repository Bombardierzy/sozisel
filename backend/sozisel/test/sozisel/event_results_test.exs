defmodule Sozisel.EventResultsTest do
  use Sozisel.DataCase

  alias Sozisel.Model.EventResults

  describe "event_results" do
    alias Sozisel.Model.EventResults.EventResult

    @valid_attrs %{participant_token: "some participant_token", result_data: "some result_data"}
    @update_attrs %{participant_token: "some updated participant_token", result_data: "some updated result_data"}
    @invalid_attrs %{participant_token: nil, result_data: nil}

    def event_result_fixture(attrs \\ %{}) do
      {:ok, event_result} =
        attrs
        |> Enum.into(@valid_attrs)
        |> EventResults.create_event_result()

      event_result
    end

    # test "list_event_results/0 returns all event_results" do
    #   event_result = event_result_fixture()
    #   assert EventResults.list_event_results() == [event_result]
    # end

    # test "get_event_result!/1 returns the event_result with given id" do
    #   event_result = event_result_fixture()
    #   assert EventResults.get_event_result!(event_result.id) == event_result
    # end

    # test "create_event_result/1 with valid data creates a event_result" do
    #   assert {:ok, %EventResult{} = event_result} = EventResults.create_event_result(@valid_attrs)
    #   assert event_result.participant_token == "some participant_token"
    #   assert event_result.result_data == "some result_data"
    # end

    # test "create_event_result/1 with invalid data returns error changeset" do
    #   assert {:error, %Ecto.Changeset{}} = EventResults.create_event_result(@invalid_attrs)
    # end

    # test "update_event_result/2 with valid data updates the event_result" do
    #   event_result = event_result_fixture()
    #   assert {:ok, %EventResult{} = event_result} = EventResults.update_event_result(event_result, @update_attrs)
    #   assert event_result.participant_token == "some updated participant_token"
    #   assert event_result.result_data == "some updated result_data"
    # end

    # test "update_event_result/2 with invalid data returns error changeset" do
    #   event_result = event_result_fixture()
    #   assert {:error, %Ecto.Changeset{}} = EventResults.update_event_result(event_result, @invalid_attrs)
    #   assert event_result == EventResults.get_event_result!(event_result.id)
    # end

    # test "delete_event_result/1 deletes the event_result" do
    #   event_result = event_result_fixture()
    #   assert {:ok, %EventResult{}} = EventResults.delete_event_result(event_result)
    #   assert_raise Ecto.NoResultsError, fn -> EventResults.get_event_result!(event_result.id) end
    # end

    # test "change_event_result/1 returns a event_result changeset" do
    #   event_result = event_result_fixture()
    #   assert %Ecto.Changeset{} = EventResults.change_event_result(event_result)
    # end
  end
end
