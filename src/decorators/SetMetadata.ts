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

import { AUTO_INJECT_ENABLED } from "../global/environment";
import { ModuleWrapper } from "../interfaces/ModuleWrapper";
import { MetadataOptions } from "../types/MetadataOptions";
import { CustomDecorator } from "../types/Decorators";
import { Reflector } from "../interfaces/Reflector";
import { InjectionToken } from "../types";
import { Type } from "../types/Type";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Sets metadata on a given class OR function.
 *
 * @public
 * @param {T} metadataKey
 * @param {V} metadataValue
 * @param {MetadataOptions} options
 * @returns {CustomDecorator<T>}
 */
export const SetMetadata = <K = string | InjectionToken, V = any>(
       metadataKey: K,
       metadataValue: V,
       options?: MetadataOptions,
): CustomDecorator<K> => {
       const factory = <I extends Object, T = Type>(
              target: any,
              key?: any,
              descriptor?: any,
       ): void => {
              if (AUTO_INJECT_ENABLED() === false) {
                     return void 0;
              }

              /** Method within as class or object will define the @see descriptor */
              if (descriptor) {
                     Reflector.registryProperty({
                            token: metadataKey as InjectionToken,
                            target: target?.constructor,
                            key: descriptor.value?.name,
                            metadata: metadataValue,
                     });

                     return descriptor;
              }

              const wrapper: ModuleWrapper<any, T> = new ModuleWrapper(
                     target,
                     metadataValue,
                     options,
              );

              if (options?.useValue) {
                     wrapper.useValue = options?.useValue;
              } else if (typeof options?.useFactory === "function") {
                     wrapper.useFactory = options?.useFactory;
              }

              Reflector.register(metadataKey as string, wrapper);
       };

       factory.KEY = metadataKey;
       return factory;
};

/**
 * Sets metadata on a given property, parameter OR class function.
 *
 * @public
 * @param {InjectionToken} token
 * @param {Any} metadata
 * @param {MetadataOptions} options
 * @returns {PropertyDecorator & ParameterDecorator}
 */
export const SetPropertyMetadata = <K extends InjectionToken, V = any>(
       token: K,
       metadata?: V,
       options?: MetadataOptions,
): PropertyDecorator & ParameterDecorator => {
       /**
        * @param {Object} target
        * @param {String} key
        * @param {Number} index
        */
       return (
              target: object,
              key: string | symbol | undefined,
              index?: number,
       ): void => {
              if (typeof index !== "number" && key) {
                     const type: any = target?.constructor;
                     /** Method parameter */
                     Reflector.registryProperty({
                            metadata: metadata,
                            target: type,
                            token: token,
                            key: key,
                     });

                     return void 0;
              }

              Reflector.registryProperty({
                     target: target as any,
                     metadata: metadata,
                     token: token,
                     index: index,
              });
       };
};
