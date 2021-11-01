import * as yup from "yup";

import { pollSchema } from "./Modules/pollSchema";
import { quizSchema } from "./Modules/quizSchema";
import { whiteboardSchema } from "./Modules/whiteboardSchema";

// import placeholder

export function createSchema(moduleType: string): yup.AnyObjectSchema {
  switch (moduleType) {
    case "Quiz":
      return quizSchema;
    case "Poll":
      return pollSchema;
    case "Whiteboard":
      return whiteboardSchema;
    // placeholder for new module
    default:
      throw Error(`Encountered unknown module type: ${moduleType}`);
  }
}
