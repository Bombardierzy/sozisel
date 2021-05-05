defmodule SoziselWeb.Schema.Mutations.QuizMutations do
  use SoziselWeb.Schema.Notation

  alias SoziselWeb.Schema.{Middlewares, Resolvers.EventResolvers}

  object :quiz_mutations do
    field :create_quiz, :event do
      arg :input, non_null(:create_quiz_input)

      middleware Middlewares.Authorization
      resolve &EventResolvers.create/3
    end

    field :update_quiz, :event do
      arg :input, non_null(:update_quiz_input)

      middleware Middlewares.Authorization
      resolve &EventResolvers.update/3
    end

    field :delete_quiz, :event do
      arg :id, non_null(:id)
      middleware Middlewares.Authorization
      resolve &EventResolvers.delete/3
    end
  end
end
