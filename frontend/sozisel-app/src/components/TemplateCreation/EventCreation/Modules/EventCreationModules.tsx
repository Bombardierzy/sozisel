import React, { ReactElement } from "react";

import { EventModuleProps } from "./EventModuleProps";
import { Poll } from "./Poll/Poll";
import Quiz from "./Quiz/Quiz";
import { QuizContextProvider } from "../../../../contexts/Quiz/QuizContext";
import Whiteboard from "./Whiteboard/Whiteboard";

// MODULE_GENERATION_PLACEHOLDER_IMPORT
export interface EventCreationModulesProps extends EventModuleProps {
  moduleType: string;
}

export function EventCreationModule({
  handleSubmit,
  errors,
  control,
  setValue,
  moduleType,
}: EventCreationModulesProps): ReactElement {
  return (
    <div>
      {moduleType === "Quiz" && (
        <QuizContextProvider>
          <Quiz
            handleSubmit={handleSubmit}
            errors={errors}
            control={control}
            setValue={setValue}
          />
        </QuizContextProvider>
      )}
      {moduleType === "Poll" && (
        <Poll
          handleSubmit={handleSubmit}
          errors={errors}
          control={control}
          setValue={setValue}
        />
      )}
      {moduleType === "Whiteboard" && (
        <Whiteboard
          handleSubmit={handleSubmit}
          errors={errors}
          control={control}
          setValue={setValue}
        />
      )}
      {/* // MODULE_GENERATION_PLACEHOLDER */}
    </div>
  );
}
