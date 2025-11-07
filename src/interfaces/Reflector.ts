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

import { DefaultResolver } from "./resolvers/DefaultResolver";
import { IModuleRegistry } from "./registry/IModuleRegistry";
import { ModuleRegistry } from "./registry/ModuleRegistry";
import { ApplicationContext } from "./ApplicationContext";
import { InjectionToken } from "../types/Injectable";
import { PropertyMap } from "../types/PropertyMap";
import { IResolver } from "./resolvers/IResolver";
import { IModuleWrapper } from "./ModuleWrapper";
import { ModuleContext } from "../types/Context";
import { LogService } from "@geeko/log";
import { Type } from "../types/Type";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Global @see IModuleWrapper registry service
 * 
 * @public
 */
export class Reflector
{
       /**
        * Default module resolver for this @see Reflector interface
        * 
        * @private
        * @type {IResolver}
        */
       private static _resolver: IResolver = void 0;

       /**
        * Default module resolver for this @see Reflector interface
        * 
        * @private
        * @type {Resolver}
        */
       private static _registry: IModuleRegistry = void 0;

       /**
        * Default logger
        * 
        * @private
        * @type {LogService}
        */
       private static _log: LogService = void 0;

       /**
        * Registers the @see IModuleWrapper instance to the global @see ModuleContainer
        * 
        * @public
        * @param {String} key 
        * @param {IModuleWrapper<I, T>} wrapper 
        */
       public static register<I, T>( key: string, wrapper: IModuleWrapper<I, T> ): void
       {
              if ( !wrapper )
              {
                     return void 0;
              }

              if ( Reflector.ready() === false )
              {
                     return void 0;
              }

              const injectables: Map<InjectionToken, Array<InjectionToken>> = Reflector._registry.injectables();
              const modules: Map<InjectionToken, IModuleWrapper<I, T>> = Reflector._registry.modules();

              /** Key is the Injector token */
              const existing: Array<InjectionToken> = injectables.get( key );
              let isArray: boolean = Array.isArray( existing );
              let name: InjectionToken = wrapper.name();

              if ( name && isArray && existing.indexOf( name ) > -1 )
              {
                     /** Already registered injectable of type @see T */
                     return void 0;
              }

              if ( wrapper.injectable === true )
              {
                     if ( isArray === false )
                     {
                            injectables.set( key, [ name ] );
                     }
                     else
                     {
                            existing.push( name );
                     }
              }

              modules.set( name, wrapper );
       }

       /**
        * Registers @see Inject properties for a given @see Type<T> target
        * 
        * @public
        * @param {PropertyMap} property 
        */
       public static registryProperty<T>( property: PropertyMap<T> ): void
       {
              if ( !property?.target?.name || !property.token )
              {
                     return void 0;
              }

              if ( Reflector.ready() === false )
              {
                     return void 0;
              }

              const properties: Map<InjectionToken, Array<PropertyMap<any>>> = Reflector._registry.properties();

              const name: string = property.target.name;
              const existing: Array<PropertyMap<T>> = properties.get( name );

              if ( !existing )
              {
                     properties.set( name, [ property ] );
                     return void 0;
              }

              existing.push( property );
       }

       /**
        * Attempts to resolve the instance of the given @see Type<T> target
        * 
        * @public
        * @param {Type<T>} target
        * @param {InjectableOptions} options
        * @returns {T}
        */
       public static get<T = new () => void>( token: InjectionToken | Type<T> ): T
       {
              if ( Reflector.ready() === false )
              {
                     return void 0;
              }

              return Reflector._resolver.resolve( token, Reflector._registry );
       }

       /**
        * Resolves a new @see ApplicationContext based on the given @see ModuleContext options
        * 
        * @public
        * @param {ModuleContext} context 
        * @returns {ApplicationContext}
       */
       public static getContext( context: ModuleContext ): ApplicationContext
       {
              /** @TODO: implement  */
              return new ApplicationContext( void 0, void 0 );
       }

       /**
        * Checks and prepares the static @see Reflector defaults
        * 
        * @public
        * @returns {Boolean}
        */
       public static ready(): boolean
       {
              try
              {
                     if ( !Reflector._log )
                     {
                            Reflector._log = new LogService( {
                                   title: "Reflect",
                                   level: "verbose"
                            } );
                     }

                     if ( !Reflector._registry )
                     {
                            Reflector.registry( new ModuleRegistry() );
                     }

                     if ( !Reflector._resolver )
                     {
                            Reflector.resolver( new DefaultResolver( this._log ) );
                     }

                     return true;
              }
              catch ( error )
              {
                     return false;
              }
       }

       /**
        * Gets/Sets the @see IResolver reference
        * 
        * @public
        * @param {IResolver} override 
        * @returns {IResolver}
        */
       public static resolver( override: IResolver ): IResolver
       {
              if ( override )
              {
                     Reflector._resolver = override;
              }

              return Reflector._resolver;
       }

       /**
        * Gets/Sets the @see IModuleRegistry reference
        * 
        * @public
        * @param {IModuleRegistry} override 
        * @returns {IModuleRegistry}
        */
       public static registry( override: IModuleRegistry ): IModuleRegistry
       {
              if ( override )
              {
                     Reflector._registry = override;
              }

              return Reflector._registry;
       }
}