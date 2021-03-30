import "./input.scss";

import { ReactElement } from "react";

interface InputProps {
  label: string;
  type: string;
}

export default function Input({ label, type }: InputProps): ReactElement {
  return (
    <>
      <label htmlFor="name">{label}</label>
      <input className="input" name="name" type={type} />
    </>
  );
}
