import "./input.scss";

import { forwardRef } from "react";

interface InputProps {
  label: string;
  type: string;
  name: string;
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, type, name, error }: InputProps, ref) => {
    return (
      <>
        <label htmlFor={name}>{label}</label>
        <input
          className={error === undefined ? "input" : "input-error"}
          name={name}
          type={type}
          ref={ref}
        />
      </>
    );
  }
);

Input.displayName = "Input";
export default Input;
