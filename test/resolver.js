const { ModuleRegistry, Test } = require('../dist/main');

const test = ModuleRegistry.resolve(Test);

console.log(test);
// test.request();