/**
     MIT License

     @Copyright (c) Metwas

     Permission is hereby granted, free of charge, to any person obtaining a copy
     of this software and associated documentation files (the "Software"), to deal
     in the Software without restriction, including without limitation the rights
     to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the Software is
     furnished to do so, subject to the following conditions:

     The above Copyright notice and this permission notice shall be included in all
     copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     AUTHORS OR Copyright HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     SOFTWARE.
*/

/**_-_-_-_-_-_-_-_-_-_-_-_-_- Imports  _-_-_-_-_-_-_-_-_-_-_-_-_-*/

import {
       SetMetadata,
       Injectable,
       Inject,
       InjectableOptions,
       CustomDecorator,
       MetadataOptions,
} from '../src/main';

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Used to reference a custom @see SetMetadata injector token
 *
 * @public
 * @type {String}
 */
export const ENCODER_INJECTABLE_TOKEN: string = 'ENCODER_INJECTABLE_TOKEN';

/**
 * @public
 */
export interface Encoder {
       encode(value: any): string;
       decode(value: string): any;
}

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
              return '0x00';
       }

       decode(value: string): any {
              return '0x01';
       }
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
