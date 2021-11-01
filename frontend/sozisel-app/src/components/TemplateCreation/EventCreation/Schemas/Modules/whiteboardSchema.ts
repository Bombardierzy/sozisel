import * as yup from "yup";

import { eventSchema } from "../eventSchema";

export const whiteboardSchema = eventSchema.clone().shape({
  task: yup.string().required("inputErrors.fieldRequired"),
});
