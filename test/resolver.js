const { Reflector, Test, C } = require('../dist/main');

const test = Reflector.get(Test);

/** @TODO: resolve from @see ModuleContext  */
const context = Reflector.createApplicationContext({
       providers: [ Test, C ],
});

console.log(context.get(Test));
// test.request();