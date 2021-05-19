import * as yup from "yup";

export const quizSchema = yup.object().shape({
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
  percentageOfParticipants: yup
    .number()
    .typeError("inputErrors.fieldRequired")
    .required("inputErrors.fieldRequired")
    .min(1, "inputErrors.incorrectPercentageValue")
    .max(100, "inputErrors.incorrectPercentageValue"),
});
