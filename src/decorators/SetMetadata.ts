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

/**_-_-_-_-_-_-_-_-_-_-_-_-_- @Imports _-_-_-_-_-_-_-_-_-_-_-_-_-*/

import { IModuleWrapper, ModuleWrapper } from "../interfaces/ModuleWrapper";
import { ModuleRegistryService } from "../services/ModuleRegistryService";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @public
 */
export type CustomTrackDecorator<T> = {
       KEY: T;
};

/**
 * Method/Function & Class decorator strong-type
 * 
 * @public
 */
export type CustomDecorator<T = string> = MethodDecorator & ClassDecorator & CustomTrackDecorator<T>;

/**
 * Sets metadata on a given class OR function.
 * 
 * @public
 * @param {T} metadataKey 
 * @param {V} metadataValue
 * @returns {CustomDecorator<T>} 
 */
export const SetMetadata = <T = string, V = any>( metadataKey: T, metadataValue: V ): CustomDecorator<T> =>
{
       const factory = ( target: any, key?: any, descriptor?: any ): void =>
       {
              if ( descriptor )
              {
                     const dependancies: Array<any> = Reflect.getMetadata( "design:paramtypes", target, key );
                     const constructor: Object = target?.constructor;

                     const wrapper: IModuleWrapper = new ModuleWrapper( constructor ?? null, dependancies );
                     wrapper.useFactory = descriptor.value;

                     ModuleRegistryService.modules.set( metadataKey as string, wrapper );

                     Reflect.defineMetadata( metadataKey, metadataValue, descriptor.value );
                     return descriptor;
              }

              const dependancies: Array<any> = Reflect.getMetadata( "design:paramtypes", target );
              const wrapper: IModuleWrapper = new ModuleWrapper( target, dependancies );

              ModuleRegistryService.modules.set( metadataKey as string, wrapper );
              Reflect.defineMetadata( metadataKey, metadataValue, target );
       };

       factory.KEY = metadataKey;
       return factory;
};

/**
 * Helper for setting the metadata for a given method parameter
 * 
 * @public
 * @param {T} metadataKey
 * @param {V} parameter
 * @returns {ParameterDecorator & CustomTrackDecorator<T>}
 */
export const SetParameter = <T, V>( metadataKey: T, parameter: Partial<V> ): ParameterDecorator & CustomTrackDecorator<T> =>
{
       const factory = ( target: object, propertyKey: string | symbol, paramIndex: number ): void =>
       {
              const params = Reflect.getMetadata( metadataKey, target[ propertyKey ] ) ?? [];

              params.push( {
                     index: paramIndex,
                     ...parameter,
              } );

              Reflect.defineMetadata( metadataKey, params, target[ propertyKey ] );
       };

       factory.KEY = metadataKey;
       return factory;
};