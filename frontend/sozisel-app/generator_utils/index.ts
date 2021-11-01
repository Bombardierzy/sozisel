// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

function getArgs() {
  const args = {};
  process.argv.slice(2, process.argv.length).forEach((arg) => {
    if (arg.slice(0, 2) === "--") {
      const longArg = arg.split("=");
      const longArgFlag = longArg[0].slice(2, longArg[0].length);
      const longArgValue = longArg.length > 1 ? longArg[1] : true;
      args[longArgFlag] = longArgValue;
    }
  });
  return args;
}

const args = getArgs();
const moduleName = args["moduleName"];
if (!moduleName) {
  throw new Error(
    "--moduleName argument is required. Example: --moduleName=Foo"
  );
}
const displayName = args["displayName"];
if (!displayName) {
  throw new Error(
    "--displayName argument is required. Example --displayName=Bar"
  );
}


/*
 * Updates hooks
 */
const locales = fs
  .readFileSync("./public/locales/pl/common.json")
  .toString()
  .replace(
    `"EventType": {`,
    `"EventType": {"${moduleName}": "${displayName}",`
  );
fs.writeFileSync("./public/locales/pl/common.json", locales);
const useGetEventTypeMessage = fs
  .readFileSync("./src/hooks/useGetEventTypeMessage.ts")
  .toString()
  .replace(
    "// placeholder for new module",
    `case EventType.${moduleName}:
return t("components.EventType.${moduleName}");\n// placeholder for new module`
  );
fs.writeFileSync(
  "./src/hooks/useGetEventTypeMessage.ts",
  useGetEventTypeMessage
);
const useGetEventTypename = fs
  .readFileSync("./src/hooks/useGetEventTypename.ts")
  .toString()
  .replace(
    "// placeholder for new module",
    `${moduleName} = "${moduleName}",\n// placeholder for new module`
  );
fs.writeFileSync("./src/hooks/useGetEventTypename.ts", useGetEventTypename);



/*
 * Event Creation generation
 */
let outputDir = "./src/components/TemplateCreation/EventCreation";
let inputDir = "./generator_utils/eventCreation";
// adding menu item
const menuItemPlaceholder = "{/* newmoduleplaceholder */}";
const eventCreationFile = fs.readFileSync(`${outputDir}/EventCreation.tsx`);
const outputTsx = eventCreationFile
  .toString()
  .replace(
    menuItemPlaceholder,
    `<MenuItem value="${moduleName}">${displayName}</MenuItem>${menuItemPlaceholder}`
  );
fs.writeFileSync(`${outputDir}/EventCreation.tsx`, outputTsx);
// creating module schema
const schemaTemplate = fs.readFileSync(`${inputDir}/schemaTemplate.ts`);
const eventSchema = schemaTemplate
  .toString()
  .replace("schemaTemplate", `${moduleName}Schema`);
fs.writeFileSync(
  `${outputDir}/Schemas/Modules/${moduleName}Schema.ts`,
  eventSchema
);
// updates create schema function
const createSchema = fs.readFileSync(`${outputDir}/Schemas/createSchema.ts`);
const createSchemaUpdated = createSchema
  .toString()
  .replace(
    "// import placeholder",
    `import { ${moduleName}Schema } from "./Modules/${moduleName}Schema";\n// import placeholder`
  )
  .replace(
    "// placeholder for new module",
    `case "${moduleName}":\nreturn ${moduleName}Schema;\n// placeholder for new module`
  );
fs.writeFileSync(`${outputDir}/Schemas/createSchema.ts`, createSchemaUpdated);
// create module component
const moduleTemplate = fs
  .readFileSync(`${inputDir}/moduleTemplate.tsx`)
  .toString()
  .split("ModuleTemplate")
  .join(moduleName);
const styleTemplate = fs.readFileSync(`${inputDir}/moduleTemplate.scss`);
fs.mkdirSync(`${outputDir}/Modules/${moduleName}`);
fs.writeFileSync(
  `${outputDir}/Modules/${moduleName}/${moduleName}.scss`,
  styleTemplate
);
fs.writeFileSync(
  `${outputDir}/Modules/${moduleName}/${moduleName}.tsx`,
  moduleTemplate
);
// import module component
const eventCreationModule = fs
  .readFileSync(`${outputDir}/Modules/EventCreationModules.tsx`)
  .toString()
  .replace(
    "// import placeholder",
    `import ${moduleName} from "./${moduleName}/${moduleName}";\n// import placeholder`
  )
  .replace(
    "{/* placeholder  for new module */}",
    `{moduleType === "${moduleName}" && (
    <${moduleName}
      handleSubmit={handleSubmit}
      errors={errors}
      control={control}
      setValue={setValue}
    />
  )}\n{/* placeholder  for new module */}`
  );
fs.writeFileSync(
  `${outputDir}/Modules/EventCreationModules.tsx`,
  eventCreationModule
);



/*
 * Event list element generation
 */
outputDir = "./src/components/TemplateCreation/EventsList/EventsListElement";
inputDir = "./generator_utils/eventListElement";
// creates module
const eventListModule = fs
  .readFileSync(`${inputDir}/moduleTemplate.tsx`)
  .toString()
  .split("ModuleTemplate")
  .join(`${moduleName}`);
const eventListStyles = fs.readFileSync(`${inputDir}/moduleTemplate.scss`);
fs.mkdirSync(`${outputDir}/${moduleName}`);
fs.writeFileSync(
  `${outputDir}/${moduleName}/${moduleName}.scss`,
  eventListStyles
);
fs.writeFileSync(
  `${outputDir}/${moduleName}/${moduleName}.tsx`,
  eventListModule
);
// updates file
const eventListElement = fs
  .readFileSync(`${outputDir}/EventListElement.tsx`)
  .toString()
  .replace(
    "// import placeholder",
    `import ${moduleName} from "./${moduleName}/${moduleName}";\n// import placeholder`
  )
  .replace(
    "// placeholder for new module",
    `case "${moduleName}": {
    return <${moduleName} data={event.eventData} />;
  }\n// placeholder for new module`
  );
fs.writeFileSync(`${outputDir}/EventListElement.tsx`, eventListElement);



/*
 * Event timeline generation
 */
outputDir = "./src/components/PresenterSession/EventsTimeline";
inputDir = "./generator_utils/eventTimeline";
// creates details module
const eventTimelineDetailsModule = fs
  .readFileSync(`${inputDir}/moduleDetails.tsx`)
  .toString()
  .split("ModuleDetails")
  .join(`${moduleName}`);
const eventTimelineDetailsStyle = fs.readFileSync(
  `${inputDir}/moduleDetails.scss`
);
fs.mkdirSync(`${outputDir}/EventDetails/${moduleName}`);
fs.writeFileSync(
  `${outputDir}/EventDetails/${moduleName}/${moduleName}.scss`,
  eventTimelineDetailsStyle
);
fs.writeFileSync(
  `${outputDir}/EventDetails/${moduleName}/${moduleName}.tsx`,
  eventTimelineDetailsModule
);
// updates event details
const eventDetails = fs
  .readFileSync(`${outputDir}/EventDetails/EventsDetails.tsx`)
  .toString()
  .replace(
    "// import placeholder",
    `import ${moduleName} from "./${moduleName}/${moduleName}";\n// import placeholder`
  )
  .replace(
    "{/* placeholder for new module */}",
    `{activeEvent.eventData.__typename === "${moduleName}" && (
      <${moduleName}
        event={activeEvent.eventData}
      />
    )}\n{/* placeholder for new module */}`
  );
fs.writeFileSync(`${outputDir}/EventDetails/EventsDetails.tsx`, eventDetails);
// creates live details module
const eventTimelineLiveDetailsModule = fs
  .readFileSync(`${inputDir}/liveEventDetails.tsx`)
  .toString()
  .split("LiveEventDetails")
  .join(`${moduleName}`);
fs.mkdirSync(`${outputDir}/LiveEventDetails/${moduleName}`);
fs.writeFileSync(
  `${outputDir}/LiveEventDetails/${moduleName}/${moduleName}.tsx`,
  eventTimelineLiveDetailsModule
);
// updates live event details
const liveEventDetails = fs
  .readFileSync(`${outputDir}/LiveEventDetails/LiveEventDetails.tsx`)
  .toString()
  .replace(
    "// import placeholder",
    `import ${moduleName} from "./${moduleName}/${moduleName}";\n// import placeholder`
  )
  .replace(
    "{/* placeholder for new module */}",
    `{eventType === EventType.${moduleName} && <${moduleName} />}\n{/* placeholder for new module */}`
  );
fs.writeFileSync(
  `${outputDir}/LiveEventDetails/LiveEventDetails.tsx`,
  liveEventDetails
);




/*
 * Participant active session module
 */
outputDir = "./src/components/ParticipantActiveSession";
inputDir = "./generator_utils/participantSession";
// creates details module
const participantModule = fs
  .readFileSync(`${inputDir}/moduleTemplate.tsx`)
  .toString()
  .split("ModuleTemplate")
  .join(`${moduleName}`);
const participantModuleStyle = fs.readFileSync(
  `${inputDir}/moduleTemplate.scss`
);
fs.mkdirSync(`${outputDir}/Modules/${moduleName}`);
fs.writeFileSync(
  `${outputDir}/Modules/${moduleName}/${moduleName}.scss`,
  participantModuleStyle
);
fs.writeFileSync(
  `${outputDir}/Modules/${moduleName}/${moduleName}.tsx`,
  participantModule
);
// updates active event
const activeEvent = fs
  .readFileSync(`${outputDir}/ActiveEvent.tsx`)
  .toString()
  .replace(
    "// import placeholder",
    `import {${moduleName}} from "./Modules/${moduleName}/${moduleName}";\n// import placeholder`
  )
  .replace(
    "// placeholder for new module",
    `case EventType.${moduleName}:
    return (
      <${moduleName}
        token={token}
        event={activeEvent}
        onFinished={onEventFinished}
      />
    );\n// placeholder for new module`
  );
fs.writeFileSync(`${outputDir}/ActiveEvent.tsx`, activeEvent);




/*
 * Event results
 */
outputDir =
  "./src/components/SessionResultScreen/SessionResultEvents/EventResultDetails";
inputDir = "./generator_utils/eventResult";
// creates result module
const eventResultModule = fs
  .readFileSync(`${inputDir}/moduleTemplate.tsx`)
  .toString()
  .split("ModuleTemplate")
  .join(`${moduleName}`);
const eventResultStyle = fs.readFileSync(`${inputDir}/moduleTemplate.scss`);
fs.mkdirSync(`${outputDir}/Modules/${moduleName}`);
fs.writeFileSync(
  `${outputDir}/Modules/${moduleName}/${moduleName}.scss`,
  eventResultStyle
);
fs.writeFileSync(
  `${outputDir}/Modules/${moduleName}/${moduleName}.tsx`,
  eventResultModule
);
// updates event result details
const eventResultDetails = fs
  .readFileSync(`${outputDir}/EventResultDetails.tsx`)
  .toString()
  .replace(
    "// import placeholder",
    `import {${moduleName}} from "./Modules/${moduleName}/${moduleName}";\n// import placeholder`
  )
  .replace(
    "{/* placeholder for a new module */}",
    `{eventType === EventType.${moduleName} && (
      <${moduleName} id={id} eventName={eventName} />
    )}\n{/* placeholder for a new module */}`
  );
fs.writeFileSync(`${outputDir}/EventResultDetails.tsx`, eventResultDetails);
