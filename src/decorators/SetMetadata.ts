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

              wrapper.injectable = options?.injectable ?? false;

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
