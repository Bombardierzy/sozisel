defmodule Sozisel.SessionRecordingsTest do
  use Sozisel.DataCase

  alias Sozisel.Model.{SessionRecordings, SessionRecordings.SessionRecording}
  alias Sozisel.Model.SessionRecordings.Annotation

  import Sozisel.Factory

  describe "session_recordings" do
    @valid_annotations [
      %{id: Ecto.UUID.generate(), timestamp: 10, label: "first label"},
      %{id: Ecto.UUID.generate(), timestamp: 15, label: "second label"},
      %{id: Ecto.UUID.generate(), timestamp: 20, label: "third label"}
    ]

    @update_annotations [
      %{id: Ecto.UUID.generate(), timestamp: 50, label: "updated label"}
    ]

    @invalid_annotations [
      %{id: Ecto.UUID.generate(), timestamp: -1, label: "some label"},
      %{id: Ecto.UUID.generate(), timestamp: 10, label: ""},
      %{}
    ]

    @valid_attrs %{path: "some path", annotations: @valid_annotations}
    @update_attrs %{path: "some updated path", annotations: @update_annotations}
    @invalid_attrs %{path: nil, annotations: @invalid_annotations}

    setup do
      [session: insert(:session)]
    end

    def session_recording_fixture(%{session: session}) do
      {:ok, session_recording} =
        %{}
        |> Enum.into(@valid_attrs)
        |> Map.put(:session_id, session.id)
        |> SessionRecordings.create_session_recording()

      session_recording
    end

    test "list_session_recordings/0 returns all session_recordings", ctx do
      session_recording = session_recording_fixture(ctx)
      assert SessionRecordings.list_session_recordings() == [session_recording]
    end

    test "get_session_recording!/1 returns the session_recording with given id", ctx do
      session_recording = session_recording_fixture(ctx)
      assert SessionRecordings.get_session_recording!(session_recording.id) == session_recording
    end

    test "create_session_recording/1 with valid data creates a session_recording", ctx do
      assert {:ok, %SessionRecording{} = session_recording} =
               SessionRecordings.create_session_recording(
                 @valid_attrs
                 |> Map.put(:session_id, ctx.session.id)
               )

      assert session_recording.path == "some path"

      valid_annotations = @valid_annotations |> Enum.map(&struct!(Annotation, &1))

      assert session_recording.annotations == valid_annotations
    end

    test "create_session_recording/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} =
               SessionRecordings.create_session_recording(@invalid_attrs)
    end

    test "update_session_recording/2 with valid data updates the session_recording", ctx do
      session_recording = session_recording_fixture(ctx)

      assert {:ok, %SessionRecording{} = session_recording} =
               SessionRecordings.update_session_recording(session_recording, @update_attrs)

      assert session_recording.path == "some updated path"
      updated_annotations = @update_annotations |> Enum.map(&struct!(Annotation, &1))

      assert session_recording.annotations == updated_annotations
    end

    test "update_session_recording/2 with invalid data returns error changeset", ctx do
      session_recording = session_recording_fixture(ctx)

      assert {:error, %Ecto.Changeset{}} =
               SessionRecordings.update_session_recording(session_recording, @invalid_attrs)

      assert session_recording == SessionRecordings.get_session_recording!(session_recording.id)
    end

    test "delete_session_recording/1 deletes the session_recording", ctx do
      session_recording = session_recording_fixture(ctx)

      assert {:ok, %SessionRecording{}} =
               SessionRecordings.delete_session_recording(session_recording)

      assert_raise Ecto.NoResultsError, fn ->
        SessionRecordings.get_session_recording!(session_recording.id)
      end
    end

    test "change_session_recording/1 returns a session_recording changeset", ctx do
      session_recording = session_recording_fixture(ctx)
      assert %Ecto.Changeset{} = SessionRecordings.change_session_recording(session_recording)
    end
  end
end
