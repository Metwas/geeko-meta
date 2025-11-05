const { ModuleRegistry, Test } = require('../dist/main');

const test = ModuleRegistry.resolve(Test);

/** @TODO: resolve from @see ModuleContext  */
const context = ModuleRegistry.resolveContext({
       providers: [],
       import: []
});

console.log(test.request);
// test.request();