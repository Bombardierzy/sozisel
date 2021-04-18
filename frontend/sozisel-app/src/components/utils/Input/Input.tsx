import "./Input.scss";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, error, ...props }: InputProps, ref) => {
    return (
      <div className="Input">
        <label htmlFor={name}>{label}</label>
        <input
          className={error === undefined ? "" : "inputError"}
          name={name}
          {...props}
          ref={ref}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
