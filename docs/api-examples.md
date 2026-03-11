---
outline: deep
---
#
### Resolve
Below is an example of how to resolve an instance which has the **@Injectable** decorator.
```typescript
import { Reflector } from '@geeko/meta';

const instance: Test = Reflector.get(Test);
```
#
### Application Context
Application contexts can be created to fine tune the dependancy output by adding custom factory functions/values & injection tokens, 
As seen below:

```typescript
import { Reflector } from '@geeko/meta';

const context: ApplicationContext = Reflector.createApplicationContext({
       providers: [Test, {
              token: "JSON_ENCODER",
              useFactory: (): Encoder => {
                     return new JsonEncoder();
              }
       }],
});

const instance: Test = context.get(Test);
```
#
#
### Get Specific Injectables
Below is an example of how to get all injectables with a specific token, in this case the **Encoding** token seen above: 
```typescript
import { Reflector } from '@geeko/meta';

const injectables: Array<any> = Reflector.getFor(ENCODER_INJECTABLE_TOKEN);
```

If the injectable is a function or member of a class

```typescript
const injectables: Array<any> | undefined = Reflector.getFor(GET_INJECTABLE_TOKEN, {
       isProperty: true,
});
````

The response will look like the following:

```javascript
[
  {
    metadata: { path: '/test' },
    target: [class Test],
    token: 'GET_INJECTABLE_TOKEN',
    key: 'get'
  }
]
```
#
#
### Get Metadata

Below code will fetch the raw metadata passed to the **@Injectable** decorator for the **Test** class example as seen below:
```typescript
const metadata: any = Reflector.getMetadata(Test);
````
#
#
**Note:** By default the resolver will automatically collect metadata ready for injection on startup, however, if you wish to only use the 'createApplicationContext' method, you can disable the automatic resolver by setting the following process environment variable **GEEKO_AUTO_INJECT**  to **0**, e.g:
```sh
 set GEEKO_AUTO_INJECT 0 node ./app.js
```
#
#
### Installation

**NPM**

```sh
npm i @geeko/meta
```
#
