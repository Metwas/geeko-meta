const { ModuleRegistry, Test } = require('../dist/main');

const test = ModuleRegistry.resolve(Test);

/** @TODO: resolve from @see ModuleContext  */
ModuleRegistry.resolveContext({
       providers: [],
       import: []
});

console.log(test);
// test.request();