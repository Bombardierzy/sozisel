defmodule Sozisel.ParticipantsTest do
  use Sozisel.DataCase

  alias Sozisel.Model.Participants

  describe "participants" do
    alias Sozisel.Model.Participants.Participant

    @valid_attrs %{email: "some@email.com", full_name: "some full_name"}
    @update_attrs %{email: "some.updated@email.com", full_name: "some updated full_name"}
    @invalid_attrs %{email: nil, full_name: nil, token: nil}

    def participant_fixture(attrs \\ %{}) do
      {:ok, participant} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Participants.create_participant()

      participant
    end

    test "list_participants/0 returns all participants" do
      participant = participant_fixture()
      assert Participants.list_participants() == [participant]
    end

    test "get_participant!/1 returns the participant with given id" do
      participant = participant_fixture()
      assert Participants.get_participant!(participant.id) == participant
    end

    test "create_participant/1 with valid data creates a participant" do
      assert {:ok, %Participant{} = participant} = Participants.create_participant(@valid_attrs)
      assert participant.email == "some@email.com"
      assert participant.full_name == "some full_name"
    end

    test "create_participant/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Participants.create_participant(@invalid_attrs)
    end

    test "update_participant/2 with valid data updates the participant" do
      participant = participant_fixture()
      assert {:ok, %Participant{} = participant} = Participants.update_participant(participant, @update_attrs)
      assert participant.email == "some.updated@email.com"
      assert participant.full_name == "some updated full_name"
    end

    test "update_participant/2 with invalid data returns error changeset" do
      participant = participant_fixture()
      assert {:error, %Ecto.Changeset{}} = Participants.update_participant(participant, @invalid_attrs)
      assert participant == Participants.get_participant!(participant.id)
    end

    test "delete_participant/1 deletes the participant" do
      participant = participant_fixture()
      assert {:ok, %Participant{}} = Participants.delete_participant(participant)
      assert_raise Ecto.NoResultsError, fn -> Participants.get_participant!(participant.id) end
    end

    test "change_participant/1 returns a participant changeset" do
      participant = participant_fixture()
      assert %Ecto.Changeset{} = Participants.change_participant(participant)
    end
  end
end
