const { Reflector, Test, C, INJECTABLE_TOKEN_KEY } = require('../dist/main');

const all = Reflector.getModules(INJECTABLE_TOKEN_KEY);

/** @TODO: resolve from @see ModuleContext  */
const context = Reflector.createApplicationContext({
       providers: [ Test, C ],
});

console.log(all);
// test.request();