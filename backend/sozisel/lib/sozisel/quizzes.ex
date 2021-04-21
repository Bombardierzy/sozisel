defmodule Sozisel.Model.Quizzes do
  @moduledoc """
  The Quizzes context.
  """

  import Ecto.Query, warn: false
  alias Sozisel.Repo

  alias Sozisel.Model.Quizzes.Quiz

  @doc """
  Returns the list of quizzes.

  ## Examples

      iex> list_quizzes()
      [%Quiz{}, ...]

  """
  def list_quizzes do
    Repo.all(Quiz)
  end

  @doc """
  Gets a single quiz.

  Raises `Ecto.NoResultsError` if the Quiz does not exist.

  ## Examples

      iex> get_quiz!(123)
      %Quiz{}

      iex> get_quiz!(456)
      ** (Ecto.NoResultsError)

  """
  def get_quiz!(id), do: Repo.get!(Quiz, id)

  @doc """
  Creates a quiz.

  ## Examples

      iex> create_quiz(%{field: value})
      {:ok, %Quiz{}}

      iex> create_quiz(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_quiz(attrs \\ %{}) do
    %Quiz{}
    |> Quiz.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a quiz.

  ## Examples

      iex> update_quiz(quiz, %{field: new_value})
      {:ok, %Quiz{}}

      iex> update_quiz(quiz, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_quiz(%Quiz{} = quiz, attrs) do
    quiz
    |> Quiz.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a quiz.

  ## Examples

      iex> delete_quiz(quiz)
      {:ok, %Quiz{}}

      iex> delete_quiz(quiz)
      {:error, %Ecto.Changeset{}}

  """
  def delete_quiz(%Quiz{} = quiz) do
    Repo.delete(quiz)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking quiz changes.

  ## Examples

      iex> change_quiz(quiz)
      %Ecto.Changeset{data: %Quiz{}}

  """
  def change_quiz(%Quiz{} = quiz, attrs \\ %{}) do
    Quiz.changeset(quiz, attrs)
  end

  alias Sozisel.Model.Quizzes.Quiz_question

  @doc """
  Returns the list of quiz_question.

  ## Examples

      iex> list_quiz_question()
      [%Quiz_question{}, ...]

  """
  def list_quiz_question do
    Repo.all(Quiz_question)
  end

  @doc """
  Gets a single quiz_question.

  Raises `Ecto.NoResultsError` if the Quiz question does not exist.

  ## Examples

      iex> get_quiz_question!(123)
      %Quiz_question{}

      iex> get_quiz_question!(456)
      ** (Ecto.NoResultsError)

  """
  def get_quiz_question!(id), do: Repo.get!(Quiz_question, id)

  @doc """
  Creates a quiz_question.

  ## Examples

      iex> create_quiz_question(%{field: value})
      {:ok, %Quiz_question{}}

      iex> create_quiz_question(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_quiz_question(attrs \\ %{}) do
    %Quiz_question{}
    |> Quiz_question.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a quiz_question.

  ## Examples

      iex> update_quiz_question(quiz_question, %{field: new_value})
      {:ok, %Quiz_question{}}

      iex> update_quiz_question(quiz_question, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_quiz_question(%Quiz_question{} = quiz_question, attrs) do
    quiz_question
    |> Quiz_question.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a quiz_question.

  ## Examples

      iex> delete_quiz_question(quiz_question)
      {:ok, %Quiz_question{}}

      iex> delete_quiz_question(quiz_question)
      {:error, %Ecto.Changeset{}}

  """
  def delete_quiz_question(%Quiz_question{} = quiz_question) do
    Repo.delete(quiz_question)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking quiz_question changes.

  ## Examples

      iex> change_quiz_question(quiz_question)
      %Ecto.Changeset{data: %Quiz_question{}}

  """
  def change_quiz_question(%Quiz_question{} = quiz_question, attrs \\ %{}) do
    Quiz_question.changeset(quiz_question, attrs)
  end
end
