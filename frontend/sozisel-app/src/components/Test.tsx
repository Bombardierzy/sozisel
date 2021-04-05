import { ReactElement, useEffect, useState } from "react";
import { useGetHelloQuery, useHelloMessagesSubscription } from "../graphql";

import JitsiFrame from "./JitsiFrame";

export default function Test(): ReactElement {
  const { data: queryData } = useGetHelloQuery();
  const { data } = useHelloMessagesSubscription();

  const [messages, setMessages] = useState<string[]>([]);
  console.log(messages);

  useEffect(() => {
    if (queryData?.hello.message) {
      setMessages((messages) => [queryData.hello.message, ...messages]);
    }
  }, [queryData]);

  useEffect(() => {
    if (data?.helloMessages?.message) {
      const message = data.helloMessages.message;
      setMessages((messages) => [message, ...messages]);
    }
  }, [data]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <JitsiFrame />
    </div>
  );
}
