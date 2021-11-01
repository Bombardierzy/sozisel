import * as yup from "yup";

import { pollSchema } from "./Modules/pollSchema";
import { quizSchema } from "./Modules/quizSchema";
import { whiteboardSchema } from "./Modules/whiteboardSchema";

// MODULE_GENERATION_PLACEHOLDER_IMPORT

export function createSchema(moduleType: string): yup.AnyObjectSchema {
  switch (moduleType) {
    case "Quiz":
      return quizSchema;
    case "Poll":
      return pollSchema;
    case "Whiteboard":
      return whiteboardSchema;
    // MODULE_GENERATION_PLACEHOLDER
    default:
      throw Error(`Encountered unknown module type: ${moduleType}`);
  }
}
