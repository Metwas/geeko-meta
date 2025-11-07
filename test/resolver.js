const { Reflector, Test } = require('../dist/main');

const test = Reflector.get(Test);

/** @TODO: resolve from @see ModuleContext  */
const context = Reflector.getContext({
       providers: [],
       import: []
});

console.log(test);
// test.request();