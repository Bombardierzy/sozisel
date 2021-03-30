import "./errorMessage.scss";

import { ReactElement } from "react";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({
  message,
}: ErrorMessageProps): ReactElement {
  return <p>{message}</p>;
}
