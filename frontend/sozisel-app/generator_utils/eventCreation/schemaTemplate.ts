import * as yup from "yup";

import { eventSchema } from "../eventSchema";

export const schemaTemplate = eventSchema.clone().shape({
  // TODO add your implementation
});
