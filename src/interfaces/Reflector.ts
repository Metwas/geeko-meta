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

import { InjectableOptions, InjectionToken } from "../types";
import { IModuleRegistry } from "./registry/IModuleRegistry";
import { AUTO_INJECT_ENABLED } from "../global/environment";
import { ApplicationContext } from "./ApplicationContext";
import { PropertyMap } from "../types/PropertyMap";
import { ModuleContext } from "../types/Context";
import { IModuleWrapper } from "./ModuleWrapper";
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
        * Singleton behaviour flag to indicate only one @see Type<T> instance can exist within this @see ModuleRegistry
        * 
        * @public
        * @type {Boolean}
        */
       public static FACTORY_BEHAVIOUR_SINGLETON: boolean = true;

       /**
        * Default module resolver for this @see ModuleRegistry interface
        * 
        * @private
        * @type {Resolver}
        */
       private static _resolver: Resolver = void 0;

       /**
        * Default module resolver for this @see ModuleRegistry interface
        * 
        * @private
        * @type {Resolver}
        */
       private static _registry: IModuleRegistry = void 0;

       /**
        * @see Inject property graph
        * 
        * @private
        * @type {Map<InjectionToken, Array<PropertyMap>>}
        */
       private static _propertyGraph: Map<InjectionToken, Array<PropertyMap<any>>> = new Map<InjectionToken, Array<PropertyMap<any>>>();

       /**
        * Registers the @see IModuleWrapper instance to the global @see ModuleContainer
        * 
        * @public
        * @param {String} key 
        * @param {IModuleWrapper<I, T>} wrapper 
        */
       public static register<I, T>( key: string, wrapper: IModuleWrapper<I, T> ): void
       {
              if ( !wrapper || AUTO_INJECT_ENABLED() === false )
              {
                     return void 0;
              }

              /** Key is the Injector token */
              const existing: Array<InjectionToken> = this._injectables.get( key );
              let isArray: boolean = Array.isArray( existing );
              let name: InjectionToken = wrapper.name();

              if ( name && isArray && existing.indexOf( name ) > -1 )
              {
                     /** Already registered injectable of type @see T */
                     return;
              }

              if ( wrapper.injectable === true )
              {
                     if ( isArray === false )
                     {
                            this._injectables.set( key, [ name ] );
                     }
                     else
                     {
                            existing.push( name );
                     }
              }

              this._modules.set( name, wrapper );
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

              const name: string = property.target.name;
              const existing: Array<PropertyMap<T>> = this._propertyGraph.get( name );

              if ( !existing )
              {
                     this._propertyGraph.set( name, [ property ] );
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
       public static resolve<T = new () => void>( target: Type<T>, options?: InjectableOptions ): T
       {
              const name: string = options?.token ?? target?.name;

              if ( typeof name !== "string" || typeof target !== "function" )
              {
                     return void 0;
              }

              const module: IModuleWrapper<T> = this._modules.get( name );

              if ( !module || module.injectable === false )
              {
                     return void 0;
              }

              const mtarget: Type<T> = module.target() as Type<T>;
              let instance: any = module.instance();

              /** Singleton behaviour if @see module already has instance assigned */
              if ( instance && ModuleRegistry.singletonBehaviour === true )
              {
                     return instance;
              }

              const propertyMap: Array<PropertyMap<T>> = this._propertyGraph.get( mtarget.name );
              const dependancies: Array<any> = Reflect.getMetadata( "design:paramtypes", mtarget );
              const plength: number = propertyMap?.length ?? 0;
              const length: number = dependancies?.length ?? 0;
              let resolved: Array<any> = [];

              if ( length > 0 )
              {
                     /** resolve dependancies first- @TODO Attempt to resolve forwardRef or circular dependancies */
                     let index: number = 0;

                     for ( ; index < length; ++index )
                     {
                            const type: Type<T> = dependancies[ index ];
                            let isInjected: boolean = false;
                            let _resolved: T = void 0;

                            for ( let i = 0; i < plength; ++i )
                            {
                                   const map: PropertyMap<T> = propertyMap[ i ];

                                   if ( map?.index === index )
                                   {
                                          isInjected = true;
                                          /** Fetch dependancy based on injected token */
                                          _resolved = this.resolve( map.target, {
                                                 token: map.token
                                          } );

                                          break;
                                   }
                            }

                            let dependancy: T = void 0;

                            if ( isInjected )
                            {
                                   /** Resolve custom module referenced by @see Inject */
                                   dependancy = _resolved;
                            }
                            else
                            {
                                   dependancy = this.resolve( type );
                            }

                            if ( !dependancy || ( isInjected && !_resolved ) )
                            {
                                   if ( ModuleRegistry.throwUninjectableDependancies === true )
                                   {
                                          throw new Error( `Unable to resolve dependancy [${dependancies[ index ]}] at index [${index}]` );
                                   }
                            }

                            resolved.push( dependancy );
                     }
              }

              if ( module.useValue )
              {
                     instance = module.useValue;
              }
              else if ( typeof module.useFactory === "function" )
              {
                     instance = module.useFactory();
              }
              else
              {
                     instance = new mtarget( ...resolved );
              }

              /** Resolve @see target injected properties */
              let pindex: number = 0;

              for ( ; pindex < plength; ++pindex )
              {
                     const property: PropertyMap<T> = propertyMap[ pindex ];

                     /** Only resolve property.key */
                     if ( typeof property.key === "string" )
                     {
                            const resolved: any = this.resolve( property.target, {
                                   token: property.token
                            } );

                            if ( !resolved )
                            {
                                   continue;
                            }

                            instance[ property.key ] = resolved;
                     }
              }

              return module.instance( instance );
       }

       /**
        * 
        * 
        * @public
        * @param {ModuleContext} context 
        * @returns {ApplicationContext}
        */
       public static resolveContext( context: ModuleContext ): ApplicationContext
       {
              /** @TODO: implement  */
              return new ApplicationContext( void 0 );
       }
}