import "./ErrorMessage.scss";

import { ReactElement } from "react";

interface ErrorMessageProps extends React.HTMLAttributes<HTMLElement> {
  message: string;
}

export default function ErrorMessage({
  message,
  ...props
}: ErrorMessageProps): ReactElement {
  return (
    <p {...props} className="ErrorMessage">
      {message}
    </p>
  );
}
