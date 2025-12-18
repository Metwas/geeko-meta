# Geeko Meta 
## _Simple dependancy injection library written for Typescript_

[![License][license-image]][license-url] [![Downloads][downloads-image]][downloads-url]

[license-url]: LICENSE
[license-image]: https://img.shields.io/badge/License-MIT-blue
[downloads-image]: https://img.shields.io/npm/dm/%40geeko%2Fmeta
[downloads-url]: https://npm-stat.com/charts.html?package=@geeko/meta

- [Auto Resolve](#Resolve)
- [Create Application Context](#Application-Context)
- [Installation](#Installation)

Part of the **Geeko** ecosystem, this library allows for automatic dependancy injection & context building.

### Resolve
Below is an example of how to resolve an instance which has the **@Injectable** decorator.
```typescript
import { Reflector } from '@geeko/meta';

const instance: Test = Reflector.get(Test);
```
**Test** class & **@Injectable** definition below:
```typescript
/**
 * @public
 */
export interface Encoder {
       encode(value: any): string;
       decode(value: string): any;
}

/**
 * Native @see JSON encoder/decoder
 *
 * @public
 */
@Injectable('JSON_ENCODER')
export class JsonEncoder implements Encoder {
       encode(value: any): string {
              return JSON.stringify(value);
       }

       decode(value: string): any {
              return JSON.parse(value);
       }
}

/**
 * @public
 */
@Injectable()
export class Test {
       /**
        * Expects @see Encoder interface - in this case the @see JsonEncoder
        *
        * @public
        * @param {Encoder} encoder
        */
       public constructor(@Inject('JSON_ENCODER') public encoder: Encoder) {}
}
```
### Application Context
Application contexts can be created to fine tune the dependancy output by adding custom factory functions/values & injection tokens, 
As seen below:

```typescript
import { Reflector } from '@geeko/meta';

const context: ApplicationContext = Reflector.createApplicationContext({
       providers: [Test, {
              token: "JSON_ENCODER"
              useFactory: (): Encoder => {
                     return new JsonEncoder();
              }
       }],
});

const instance: Test = context.get(Test);
```
**Note:** By default the resolver will automatically collect metadata ready for injection on startup, however, if you wish to only use the 'createApplicationContext' method, you can disable the automatic resolver by setting the following process environment variable **GEEKO_AUTO_INJECT**  to **0**, e.g:
```sh
 set GEEKO_AUTO_INJECT 0 node ./app.js
```
Logging can also be disabled by setting the process environment variable **GEEKO_META_LOGGER_LEVEL** to **0**
## Installation

**NPM**

```sh
npm i @geeko/meta
```
