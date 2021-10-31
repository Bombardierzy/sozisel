// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

function getArgs() {
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach( arg => {
        if (arg.slice(0,2) === '--') {
            const longArg = arg.split('=');
            const longArgFlag = longArg[0].slice(2,longArg[0].length);
            const longArgValue = longArg.length > 1 ? longArg[1] : true;
            args[longArgFlag] = longArgValue;
        }
    });
    return args;
}

const args = getArgs()
const moduleName = args['moduleName'];
if (!moduleName) {
    throw new Error("--moduleName argument is required. Example: --moduleName=Foo");
}
const displayName = args['displayName'];
if (!displayName) {
    throw new Error("--displayName argument is required. Example --displayName=Bar");
}
const dir = './src/components/TemplateCreation/EventCreation';
// adding menu item
const menuItemPlaceholder = '{/* newmoduleplaceholder */}';
const eventCreationFile = fs.readFileSync(`${dir}/EventCreation.tsx`);
const outputTsx = eventCreationFile.toString().replace(menuItemPlaceholder, `<MenuItem value="${moduleName}">${displayName}</MenuItem>${menuItemPlaceholder}`);
fs.writeFileSync('./src/components/TemplateCreation/EventCreation/EventCreation.tsx', outputTsx);
