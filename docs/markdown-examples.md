---
outline: deep
---
### Assign an Injectable
```typescript

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


@Injectable('JSON_ENCODER')
export class JsonEncoder implements Encoder {
       encode(value: any): string {
              return JSON.stringify(value);
       }

       decode(value: string): any {
              return JSON.parse(value);
       }
}
```
#
#
### Create a custom Injectable
Below is an example of how to create a custom injectable using the **SetMetadata**: 
```typescript
import { SetMetadata, CustomDecorator, MetadataOptions } from '@geeko/meta';

/**
 * Custom @see Encoder based injection declaration.
 *
 * @public
 * @param {InjectableOptions | String} options
 * @returns {CustomDecorator<T>}
 */
export const Encoding = (
       options?: string | InjectableOptions,
): CustomDecorator => {
       let metadata: MetadataOptions = Object.assign(
              typeof options === 'string'
                     ? { token: options }
                     : (options ?? {}),
              {
                     injectable: true,
              },
       );

       return SetMetadata(ENCODER_INJECTABLE_TOKEN, true, metadata);
};

/**
 * Custom hex encoder definition
 *
 * @public
 */
@Encoding('hex')
export class HexEncoder implements Encoder {
       encode(value: any): string {
              return toHex(value);
       }

       decode(value: string): any {
              return fromHex(value);
       }
}
```
#
