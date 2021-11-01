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
const dir = "./src/components/TemplateCreation/EventCreation";
// adding menu item
const menuItemPlaceholder = "{/* newmoduleplaceholder */}";
const eventCreationFile = fs.readFileSync(`${dir}/EventCreation.tsx`);
const outputTsx = eventCreationFile
  .toString()
  .replace(
    menuItemPlaceholder,
    `<MenuItem value="${moduleName}">${displayName}</MenuItem>${menuItemPlaceholder}`
  );
fs.writeFileSync(`${dir}/EventCreation.tsx`, outputTsx);
// creating module schema
const schemaTemplate = fs.readFileSync(
  `./generator_utils/eventCreation/schemaTemplate.ts`
);
const eventSchema = schemaTemplate
  .toString()
  .replace("schemaTemplate", `${moduleName}Schema`);
fs.writeFileSync(`${dir}/Schemas/Modules/${moduleName}Schema.ts`, eventSchema);
// updates create schema function
const createSchema = fs.readFileSync(`${dir}/Schemas/createSchema.ts`);
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
fs.writeFileSync(`${dir}/Schemas/createSchema.ts`, createSchemaUpdated);
// create module component
const moduleTemplate = fs
  .readFileSync("./generator_utils/EventCreation/moduleTemplate.tsx")
  .toString()
  .replaceAll("ModuleTemplate", moduleName);
const styleTemplate = fs.readFileSync(
  "./generator_utils/EventCreation/moduleTemplate.scss"
);
fs.mkdirSync(`${dir}/Modules/${moduleName}`);
fs.writeFileSync(
  `${dir}/Modules/${moduleName}/${moduleName}.scss`,
  styleTemplate
);
fs.writeFileSync(
  `${dir}/Modules/${moduleName}/${moduleName}.tsx`,
  moduleTemplate
);
// import module component
const eventCreationModule = fs
  .readFileSync(`${dir}/Modules/EventCreationModules.tsx`)
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
  `${dir}/Modules/EventCreationModules.tsx`,
  eventCreationModule
);
