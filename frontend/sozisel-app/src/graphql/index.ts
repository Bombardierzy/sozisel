import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type HelloMessage = {
  __typename?: 'HelloMessage';
  message: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginResult = {
  __typename?: 'LoginResult';
  token: Scalars['String'];
};

export type RootMutationType = {
  __typename?: 'RootMutationType';
  hello: HelloMessage;
  login?: Maybe<LoginResult>;
  register?: Maybe<User>;
};


export type RootMutationTypeHelloArgs = {
  from: Scalars['String'];
};


export type RootMutationTypeLoginArgs = {
  input: LoginInput;
};


export type RootMutationTypeRegisterArgs = {
  input: RegisterInput;
};

export type RootQueryType = {
  __typename?: 'RootQueryType';
  hello: HelloMessage;
  me: User;
};

export type RegisterInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
};

export type RootSubscriptionType = {
  __typename?: 'RootSubscriptionType';
  helloMessages?: Maybe<HelloMessage>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
};

export type SendHelloMutationVariables = Exact<{
  from: Scalars['String'];
}>;


export type SendHelloMutation = (
  { __typename?: 'RootMutationType' }
  & { hello: (
    { __typename?: 'HelloMessage' }
    & Pick<HelloMessage, 'message'>
  ) }
);

export type GetHelloQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHelloQuery = (
  { __typename?: 'RootQueryType' }
  & { hello: (
    { __typename?: 'HelloMessage' }
    & Pick<HelloMessage, 'message'>
  ) }
);

export type HelloMessagesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type HelloMessagesSubscription = (
  { __typename?: 'RootSubscriptionType' }
  & { helloMessages?: Maybe<(
    { __typename?: 'HelloMessage' }
    & Pick<HelloMessage, 'message'>
  )> }
);


export const SendHelloDocument = gql`
    mutation SendHello($from: String!) {
  hello(from: $from) {
    message
  }
}
    `;
export type SendHelloMutationFn = Apollo.MutationFunction<SendHelloMutation, SendHelloMutationVariables>;

/**
 * __useSendHelloMutation__
 *
 * To run a mutation, you first call `useSendHelloMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendHelloMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendHelloMutation, { data, loading, error }] = useSendHelloMutation({
 *   variables: {
 *      from: // value for 'from'
 *   },
 * });
 */
export function useSendHelloMutation(baseOptions?: Apollo.MutationHookOptions<SendHelloMutation, SendHelloMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendHelloMutation, SendHelloMutationVariables>(SendHelloDocument, options);
      }
export type SendHelloMutationHookResult = ReturnType<typeof useSendHelloMutation>;
export type SendHelloMutationResult = Apollo.MutationResult<SendHelloMutation>;
export type SendHelloMutationOptions = Apollo.BaseMutationOptions<SendHelloMutation, SendHelloMutationVariables>;
export const GetHelloDocument = gql`
    query GetHello {
  hello {
    message
  }
}
    `;

/**
 * __useGetHelloQuery__
 *
 * To run a query within a React component, call `useGetHelloQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHelloQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHelloQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetHelloQuery(baseOptions?: Apollo.QueryHookOptions<GetHelloQuery, GetHelloQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetHelloQuery, GetHelloQueryVariables>(GetHelloDocument, options);
      }
export function useGetHelloLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetHelloQuery, GetHelloQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetHelloQuery, GetHelloQueryVariables>(GetHelloDocument, options);
        }
export type GetHelloQueryHookResult = ReturnType<typeof useGetHelloQuery>;
export type GetHelloLazyQueryHookResult = ReturnType<typeof useGetHelloLazyQuery>;
export type GetHelloQueryResult = Apollo.QueryResult<GetHelloQuery, GetHelloQueryVariables>;
export const HelloMessagesDocument = gql`
    subscription HelloMessages {
  helloMessages {
    message
  }
}
    `;

/**
 * __useHelloMessagesSubscription__
 *
 * To run a query within a React component, call `useHelloMessagesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useHelloMessagesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHelloMessagesSubscription({
 *   variables: {
 *   },
 * });
 */
export function useHelloMessagesSubscription(baseOptions?: Apollo.SubscriptionHookOptions<HelloMessagesSubscription, HelloMessagesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<HelloMessagesSubscription, HelloMessagesSubscriptionVariables>(HelloMessagesDocument, options);
      }
export type HelloMessagesSubscriptionHookResult = ReturnType<typeof useHelloMessagesSubscription>;
export type HelloMessagesSubscriptionResult = Apollo.SubscriptionResult<HelloMessagesSubscription>;