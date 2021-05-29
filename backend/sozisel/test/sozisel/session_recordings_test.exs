defmodule Sozisel.SessionRecordingsTest do
  use Sozisel.DataCase

  alias Sozisel.Model.{SessionRecordings, SessionRecordings.SessionRecording}

  describe "session_recordings" do
    @valid_attrs %{metadata: %{}, path: "some path"}
    @update_attrs %{metadata: %{}, path: "some updated path"}
    @invalid_attrs %{metadata: nil, path: nil}

    def session_recording_fixture(attrs \\ %{}) do
      {:ok, session_recording} =
        attrs
        |> Enum.into(@valid_attrs)
        |> SessionRecordings.create_session_recording()

      session_recording
    end

    test "list_session_recordings/0 returns all session_recordings" do
      session_recording = session_recording_fixture()
      assert SessionRecordings.list_session_recordings() == [session_recording]
    end

    test "get_session_recording!/1 returns the session_recording with given id" do
      session_recording = session_recording_fixture()
      assert SessionRecordings.get_session_recording!(session_recording.id) == session_recording
    end

    test "create_session_recording/1 with valid data creates a session_recording" do
      assert {:ok, %SessionRecording{} = session_recording} =
               SessionRecordings.create_session_recording(@valid_attrs)

      assert session_recording.metadata == %{}
      assert session_recording.path == "some path"
    end

    test "create_session_recording/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} =
               SessionRecordings.create_session_recording(@invalid_attrs)
    end

    test "update_session_recording/2 with valid data updates the session_recording" do
      session_recording = session_recording_fixture()

      assert {:ok, %SessionRecording{} = session_recording} =
               SessionRecordings.update_session_recording(session_recording, @update_attrs)

      assert session_recording.metadata == %{}
      assert session_recording.path == "some updated path"
    end

    test "update_session_recording/2 with invalid data returns error changeset" do
      session_recording = session_recording_fixture()

      assert {:error, %Ecto.Changeset{}} =
               SessionRecordings.update_session_recording(session_recording, @invalid_attrs)

      assert session_recording == SessionRecordings.get_session_recording!(session_recording.id)
    end

    test "delete_session_recording/1 deletes the session_recording" do
      session_recording = session_recording_fixture()

      assert {:ok, %SessionRecording{}} =
               SessionRecordings.delete_session_recording(session_recording)

      assert_raise Ecto.NoResultsError, fn ->
        SessionRecordings.get_session_recording!(session_recording.id)
      end
    end

    test "change_session_recording/1 returns a session_recording changeset" do
      session_recording = session_recording_fixture()
      assert %Ecto.Changeset{} = SessionRecordings.change_session_recording(session_recording)
    end
  end
end
