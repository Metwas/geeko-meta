/**
 * Copyright (c) Metwas
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

/**_-_-_-_-_-_-_-_-_-_-_-_-_- Imports  _-_-_-_-_-_-_-_-_-_-_-_-_-*/

import {
       SetPropertyMetadata,
       InjectableOptions,
       MetadataOptions,
       CustomDecorator,
       SetMetadata,
       Injectable,
       Inject,
} from "../src/main";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Used to reference a custom @see SetMetadata injector token
 *
 * @public
 * @type {String}
 */
export const ENCODER_INJECTABLE_TOKEN: string = "ENCODER_INJECTABLE_TOKEN";

/**
 * Used to reference a custom GET rest API @see SetMetadata injector token
 *
 * @public
 * @type {String}
 */
export const GET_INJECTABLE_TOKEN: string = "GET_INJECTABLE_TOKEN";

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
              typeof options === "string"
                     ? { token: options }
                     : (options ?? {}),
              {
                     injectable: true,
              },
       );

       return SetMetadata(ENCODER_INJECTABLE_TOKEN, metadata, metadata);
};

/**
 * Custom @see Get Rest decorator
 *
 * @public
 * @param {String} path
 * @returns {PropertyDecorator<T>}
 */
export const Get = (path: string): PropertyDecorator => {
       return SetPropertyMetadata(GET_INJECTABLE_TOKEN, { path: path }, void 0);
};

/**
 * Custom hex encoder definition
 *
 * @public
 */
@Encoding("hex")
export class HexEncoder implements Encoder {
       public encode(value: any): string {
              return "0x00";
       }

       public decode(value: string): any {
              return "0x01";
       }
}

/**
 * Native @see JSON encoder/decoder
 *
 * @public
 */
@Injectable("JSON_ENCODER")
export class JsonEncoder implements Encoder {
       public encode(value: any): string {
              return JSON.stringify(value);
       }

       public decode(value: string): any {
              return JSON.parse(value);
       }
}

/**
 * @public
 */
@Injectable({ key: 420 })
export class Test {
       /**
        * Expects @see Encoder interface - in this case the @see JsonEncoder
        *
        * @public
        * @param {Encoder} encoder
        */
       public constructor(@Inject("JSON_ENCODER") public encoder: Encoder) {}

       /**
        * API get request example
        */
       @Get("/test")
       public get() {
              return "GET Request";
       }
}
