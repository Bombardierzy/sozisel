import * as yup from "yup";

export const eventSchema = yup.object().shape({
  eventName: yup.string().required("inputErrors.fieldRequired"),
  durationTime: yup
    .number()
    .min(1, "inputErrors.incorrectDurationTime")
    .typeError("inputErrors.fieldRequired")
    .required("inputErrors.fieldRequired"),
  startMinute: yup
    .number()
    .min(1, "inputErrors.incorrectStartMinute")
    .typeError("inputErrors.fieldRequired")
    .required("inputErrors.fieldRequired"),
});

export const quizSchema = eventSchema.clone().shape({
  percentageOfParticipants: yup
    .number()
    .typeError("inputErrors.fieldRequired")
    .required("inputErrors.fieldRequired")
    .min(1, "inputErrors.incorrectPercentageValue")
    .max(100, "inputErrors.incorrectPercentageValue"),
});

export const pollSchema = eventSchema.clone().shape({
  isMultiChoice: yup.boolean().required("inputErrors.fieldRequired"),
  question: yup.string().required("inputErrors.fieldRequired"),
});
