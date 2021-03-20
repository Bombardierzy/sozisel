import { ReactElement, useEffect, useState } from "react";
import { useGetHelloQuery, useHelloMessagesSubscription } from "../graphql";

export default function Test(): ReactElement {
  const { data: queryData } = useGetHelloQuery();
  const {data} = useHelloMessagesSubscription();
  
  const [messages, setMessages] = useState<string[]>([]);
  
  useEffect(() => {
    if (queryData?.hello.message) {
      setMessages(messages => [queryData.hello.message, ...messages]);
    }
  }, [queryData]);
  

  useEffect(() => {
    if (data?.helloMessages?.message) {
      const message = data.helloMessages.message;
      setMessages(messages => [message, ...messages]);
    }
  }, [data]);

  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      {messages.map(msg => (
        <span key={msg}>{msg}</span>
      ))}
    </div>
  );
}
