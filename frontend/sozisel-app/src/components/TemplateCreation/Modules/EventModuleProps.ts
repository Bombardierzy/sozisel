import { Control, DeepMap, FieldError } from "react-hook-form";

export interface EventModuleProps {
  /*eslint-disable */
  errors: DeepMap<Record<string, any>, FieldError>;
  handleSubmit: (cb: any) => () => void;
  /*eslint-enable */
  control: Control;
  setValue: (
    name: string,
    value: string | number | boolean,
    config?:
      | Partial<{
          shouldValidate: boolean;
          shouldDirty: boolean;
        }>
      | undefined
  ) => void;
}
