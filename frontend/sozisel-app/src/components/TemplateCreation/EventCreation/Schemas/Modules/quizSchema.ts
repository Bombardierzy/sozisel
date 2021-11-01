import * as yup from "yup";

import { eventSchema } from "../eventSchema";

export const quizSchema = eventSchema.clone().shape({
  percentageOfParticipants: yup
    .number()
    .typeError("inputErrors.fieldRequired")
    .required("inputErrors.fieldRequired")
    .min(1, "inputErrors.incorrectPercentageValue")
    .max(100, "inputErrors.incorrectPercentageValue"),
});
