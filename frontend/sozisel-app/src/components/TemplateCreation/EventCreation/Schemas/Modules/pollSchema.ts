import * as yup from "yup";

import { eventSchema } from "../eventSchema";

export const pollSchema = eventSchema.clone().shape({
  isMultiChoice: yup.boolean().required("inputErrors.fieldRequired"),
  question: yup.string().required("inputErrors.fieldRequired"),
});
