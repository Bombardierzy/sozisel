/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

const HELP = `
usage node index.js 
        [--moduleName=value]
        [--displayName=value]
`;
const ARGS = ["--moduleName", "--displayName"];
interface GeneratorArgs {
  displayName: string;
  moduleName: string;
}
function parseArguments(): GeneratorArgs {
  const args = {
    displayName: "",
    moduleName: "",
  };
  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith("--")) {
      const [argument, value] = arg.split("=");
      if (!argument || !value || !ARGS.includes(argument)) {
        throw new Error(`Invalid command: ${HELP}`);
      }

      const arg = argument.slice(2); // strip '--'
      args[arg] = value;
    }
  });
  return args;
}
const { displayName, moduleName } = parseArguments();

interface UpdateFileProps {
  file: string;
  replaceWith: string;
  importPath?: string;
}

function updateFile({ file, replaceWith, importPath }: UpdateFileProps): void {
  const import_placeholder = "// MODULE_GENERATION_PLACEHOLDER_IMPORT";
  const content_placeholder_v1 = "// MODULE_GENERATION_PLACEHOLDER";
  const content_placeholder_v2 = "{/* MODULE_GENERATION_PLACEHOLDER */}";
  const result = fs
    .readFileSync(file)
    .toString()
    .replace(`${import_placeholder}`, `${importPath}\n${import_placeholder}`)
    .replace(
      `${content_placeholder_v1}`,
      `${replaceWith}\n${content_placeholder_v1}`
    )
    .replace(
      `${content_placeholder_v2}`,
      `${replaceWith}\n${content_placeholder_v2}`
    );
  fs.writeFileSync(`${file}`, result);
}

interface CreateModuleProps {
  inputPath: string;
  outputPath: string;
}

function createModule({ inputPath, outputPath }: CreateModuleProps): void {
  const moduleTemplate = fs
    .readFileSync(`${inputPath}`)
    .toString()
    .split("ModuleTemplate")
    .join(`${moduleName}`);
  fs.writeFileSync(`${outputPath}`, moduleTemplate);
}

/*
 * Update locales
 */
const locales = fs
  .readFileSync("./public/locales/pl/common.json")
  .toString()
  .replace(
    `"EventType": {`,
    `"EventType": {"${moduleName}": "${displayName}",`
  );
fs.writeFileSync("./public/locales/pl/common.json", locales);

/*
 * updates hooks
 */
updateFile({
  file: "./src/hooks/useGetEventTypeMessage.ts",
  replaceWith: `case EventType.${moduleName}:
return t("components.EventType.${moduleName}");`,
});
updateFile({
  file: "./src/hooks/useGetEventTypename.ts",
  replaceWith: `${moduleName} = "${moduleName}",`,
});

/*
 * Event Creation generation
 */
let outputDir = "./src/components/TemplateCreation/EventCreation";
let inputDir = "./generator_utils/eventCreation";
// adding menu item
updateFile({
  file: `${outputDir}/EventCreation.tsx`,
  replaceWith: `<MenuItem value="${moduleName}">${displayName}</MenuItem>`,
});

// creating module schema
const schemaTemplate = fs
  .readFileSync(`${inputDir}/schemaTemplate.ts`)
  .toString()
  .replace("schemaTemplate", `${moduleName}Schema`);
fs.writeFileSync(
  `${outputDir}/Schemas/Modules/${moduleName}Schema.ts`,
  schemaTemplate
);
// updates create schema function
updateFile({
  file: `${outputDir}/Schemas/createSchema.ts`,
  replaceWith: `case "${moduleName}":\nreturn ${moduleName}Schema;`,
  importPath: `import { ${moduleName}Schema } from "./Modules/${moduleName}Schema";`,
});

// create module component
fs.mkdirSync(`${outputDir}/Modules/${moduleName}`);
createModule({
  inputPath: `${inputDir}/moduleTemplate.tsx`,
  outputPath: `${outputDir}/Modules/${moduleName}/${moduleName}.tsx`,
});
createModule({
  inputPath: `${inputDir}/moduleTemplate.scss`,
  outputPath: `${outputDir}/Modules/${moduleName}/${moduleName}.scss`,
});
// import module component
updateFile({
  file: `${outputDir}/Modules/EventCreationModules.tsx`,
  replaceWith: `{moduleType === "${moduleName}" && (
  <${moduleName}
    handleSubmit={handleSubmit}
    errors={errors}
    control={control}
    setValue={setValue}
  />
)}`,
  importPath: `import ${moduleName} from "./${moduleName}/${moduleName}";`,
});

/*
 * Event list element generation
 */
outputDir = "./src/components/TemplateCreation/EventsList/EventsListElement";
inputDir = "./generator_utils/eventListElement";
// creates module
fs.mkdirSync(`${outputDir}/${moduleName}`);
createModule({
  inputPath: `${inputDir}/moduleTemplate.tsx`,
  outputPath: `${outputDir}/${moduleName}/${moduleName}.tsx`,
});
createModule({
  inputPath: `${inputDir}/moduleTemplate.scss`,
  outputPath: `${outputDir}/${moduleName}/${moduleName}.scss`,
});
// updates file
updateFile({
  file: `${outputDir}/EventListElement.tsx`,
  replaceWith: `case "${moduleName}": {
  return <${moduleName} data={event.eventData} />;
}`,
  importPath: `import ${moduleName} from "./${moduleName}/${moduleName}";`,
});

/*
 * Event timeline generation
 */
outputDir = "./src/components/PresenterSession/EventsTimeline";
inputDir = "./generator_utils/eventTimeline";
// creates details module
fs.mkdirSync(`${outputDir}/EventDetails/${moduleName}`);
createModule({
  inputPath: `${inputDir}/moduleTemplate.tsx`,
  outputPath: `${outputDir}/EventDetails/${moduleName}/${moduleName}.tsx`,
});
createModule({
  inputPath: `${inputDir}/moduleTemplate.scss`,
  outputPath: `${outputDir}/EventDetails/${moduleName}/${moduleName}.scss`,
});
// updates event details
updateFile({
  file: `${outputDir}/EventDetails/EventsDetails.tsx`,
  replaceWith: `{activeEvent.eventData.__typename === "${moduleName}" && (
  <${moduleName}
    event={activeEvent.eventData}
  />
)}`,
  importPath: `import ${moduleName} from "./${moduleName}/${moduleName}";`,
});
// creates live details module
fs.mkdirSync(`${outputDir}/LiveEventDetails/${moduleName}`);
createModule({
  inputPath: `${inputDir}/liveEventModuleTemplate.tsx`,
  outputPath: `${outputDir}/LiveEventDetails/${moduleName}/${moduleName}.tsx`,
});
// updates live event details
updateFile({
  file: `${outputDir}/LiveEventDetails/LiveEventDetails.tsx`,
  replaceWith: `{eventType === EventType.${moduleName} && <${moduleName} />}`,
  importPath: `import ${moduleName} from "./${moduleName}/${moduleName}";`,
});

/*
 * Participant active session module
 */
outputDir = "./src/components/ParticipantActiveSession";
inputDir = "./generator_utils/participantSession";
// creates details module
fs.mkdirSync(`${outputDir}/Modules/${moduleName}`);
createModule({
  inputPath: `${inputDir}/moduleTemplate.tsx`,
  outputPath: `${outputDir}/Modules/${moduleName}/${moduleName}.tsx`,
});
createModule({
  inputPath: `${inputDir}/moduleTemplate.scss`,
  outputPath: `${outputDir}/Modules/${moduleName}/${moduleName}.scss`,
});
// updates active event
updateFile({
  file: `${outputDir}/ActiveEvent.tsx`,
  replaceWith: `case EventType.${moduleName}:
return (
  <${moduleName}
    token={token}
    event={activeEvent}
    onFinished={onEventFinished}
  />
);`,
  importPath: `import {${moduleName}} from "./Modules/${moduleName}/${moduleName}";`,
});

/*
 * Event results
 */
outputDir =
  "./src/components/SessionResultScreen/SessionResultEvents/EventResultDetails";
inputDir = "./generator_utils/eventResult";
// creates result module
fs.mkdirSync(`${outputDir}/Modules/${moduleName}`);
createModule({
  inputPath: `${inputDir}/moduleTemplate.tsx`,
  outputPath: `${outputDir}/Modules/${moduleName}/${moduleName}.tsx`,
});
createModule({
  inputPath: `${inputDir}/moduleTemplate.scss`,
  outputPath: `${outputDir}/Modules/${moduleName}/${moduleName}.scss`,
});
// updates event result details
updateFile({
  file: `${outputDir}/EventResultDetails.tsx`,
  replaceWith: `{eventType === EventType.${moduleName} && (
  <${moduleName} id={id} eventName={eventName} />
)}`,
  importPath: `import {${moduleName}} from "./Modules/${moduleName}/${moduleName}";`,
});
