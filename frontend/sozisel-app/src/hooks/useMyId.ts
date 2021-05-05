import { useMeQuery } from "../graphql";

export default function useMyId(): string | undefined {
  const { data } = useMeQuery();

  return data?.me.id;
}
