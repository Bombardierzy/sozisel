defmodule Sozisel.QuizzesTest do
  use Sozisel.DataCase

  alias Sozisel.Quizzes

  describe "quizzes" do
    alias Sozisel.Quizzes.Quiz

    @valid_attrs %{duration_time: 42, number_of_targets: 42, tracking_mode: true}
    @update_attrs %{duration_time: 43, number_of_targets: 43, tracking_mode: false}
    @invalid_attrs %{duration_time: nil, number_of_targets: nil, tracking_mode: nil}

    def quiz_fixture(attrs \\ %{}) do
      {:ok, quiz} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Quizzes.create_quiz()

      quiz
    end

    test "list_quizzes/0 returns all quizzes" do
      quiz = quiz_fixture()
      assert Quizzes.list_quizzes() == [quiz]
    end

    test "get_quiz!/1 returns the quiz with given id" do
      quiz = quiz_fixture()
      assert Quizzes.get_quiz!(quiz.id) == quiz
    end

    test "create_quiz/1 with valid data creates a quiz" do
      assert {:ok, %Quiz{} = quiz} = Quizzes.create_quiz(@valid_attrs)
      assert quiz.duration_time == 42
      assert quiz.number_of_targets == 42
      assert quiz.tracking_mode == true
    end

    test "create_quiz/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Quizzes.create_quiz(@invalid_attrs)
    end

    test "update_quiz/2 with valid data updates the quiz" do
      quiz = quiz_fixture()
      assert {:ok, %Quiz{} = quiz} = Quizzes.update_quiz(quiz, @update_attrs)
      assert quiz.duration_time == 43
      assert quiz.number_of_targets == 43
      assert quiz.tracking_mode == false
    end

    test "update_quiz/2 with invalid data returns error changeset" do
      quiz = quiz_fixture()
      assert {:error, %Ecto.Changeset{}} = Quizzes.update_quiz(quiz, @invalid_attrs)
      assert quiz == Quizzes.get_quiz!(quiz.id)
    end

    test "delete_quiz/1 deletes the quiz" do
      quiz = quiz_fixture()
      assert {:ok, %Quiz{}} = Quizzes.delete_quiz(quiz)
      assert_raise Ecto.NoResultsError, fn -> Quizzes.get_quiz!(quiz.id) end
    end

    test "change_quiz/1 returns a quiz changeset" do
      quiz = quiz_fixture()
      assert %Ecto.Changeset{} = Quizzes.change_quiz(quiz)
    end
  end

  describe "quiz_question" do
    alias Sozisel.Quizzes.Quiz_question

    @valid_attrs %{answers: [], correct_answers: [], question: "some question"}
    @update_attrs %{answers: [], correct_answers: [], question: "some updated question"}
    @invalid_attrs %{answers: nil, correct_answers: nil, question: nil}

    def quiz_question_fixture(attrs \\ %{}) do
      {:ok, quiz_question} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Quizzes.create_quiz_question()

      quiz_question
    end

    test "list_quiz_question/0 returns all quiz_question" do
      quiz_question = quiz_question_fixture()
      assert Quizzes.list_quiz_question() == [quiz_question]
    end

    test "get_quiz_question!/1 returns the quiz_question with given id" do
      quiz_question = quiz_question_fixture()
      assert Quizzes.get_quiz_question!(quiz_question.id) == quiz_question
    end

    test "create_quiz_question/1 with valid data creates a quiz_question" do
      assert {:ok, %Quiz_question{} = quiz_question} = Quizzes.create_quiz_question(@valid_attrs)
      assert quiz_question.answers == []
      assert quiz_question.correct_answers == []
      assert quiz_question.question == "some question"
    end

    test "create_quiz_question/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Quizzes.create_quiz_question(@invalid_attrs)
    end

    test "update_quiz_question/2 with valid data updates the quiz_question" do
      quiz_question = quiz_question_fixture()
      assert {:ok, %Quiz_question{} = quiz_question} = Quizzes.update_quiz_question(quiz_question, @update_attrs)
      assert quiz_question.answers == []
      assert quiz_question.correct_answers == []
      assert quiz_question.question == "some updated question"
    end

    test "update_quiz_question/2 with invalid data returns error changeset" do
      quiz_question = quiz_question_fixture()
      assert {:error, %Ecto.Changeset{}} = Quizzes.update_quiz_question(quiz_question, @invalid_attrs)
      assert quiz_question == Quizzes.get_quiz_question!(quiz_question.id)
    end

    test "delete_quiz_question/1 deletes the quiz_question" do
      quiz_question = quiz_question_fixture()
      assert {:ok, %Quiz_question{}} = Quizzes.delete_quiz_question(quiz_question)
      assert_raise Ecto.NoResultsError, fn -> Quizzes.get_quiz_question!(quiz_question.id) end
    end

    test "change_quiz_question/1 returns a quiz_question changeset" do
      quiz_question = quiz_question_fixture()
      assert %Ecto.Changeset{} = Quizzes.change_quiz_question(quiz_question)
    end
  end
end
