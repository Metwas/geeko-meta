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

import { InjectionToken, PropertyMap, Type } from "../../types";
import { ResolverOptions } from "../../types/ResolverOptions";
import { IModuleRegistry } from "../registry/IModuleRegistry";
import { ModuleWrapper } from "../ModuleWrapper";
import { LogService } from "@geeko/log";
import { IResolver } from "./IResolver";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Core @see ModuleWrapper resolver interface
 * 
 * @public 
 */
export class DefaultResolver implements IResolver
{
       /**
        * @public
        * @param {LogService} log 
        */
       public constructor( public readonly log: LogService ) { }

       /**
        * Resolves the given token @see InjectionToken OR @see Type<T> from the configured @see IModuleRegistry
        * 
        * @public 
        * @param {InjectionToken | Type<T>} token 
        * @param {IModuleRegistry} registry
        * @param {ResolverOptions} options
        */
       public resolve<T>( token: InjectionToken | Type<T>, registry: IModuleRegistry, options?: ResolverOptions ): T
       {
              try
              {
                     const name: string = typeof token === "function" ? token?.name : token;

                     if ( !registry || !name )
                     {
                            return void 0;
                     }

                     const properties: Map<InjectionToken, Array<PropertyMap<any>>> = registry.properties();
                     const modules: Map<InjectionToken, ModuleWrapper<any, T>> = registry.modules();

                     const module: ModuleWrapper<any, T> = modules.get( name );

                     if ( !module || module.injectable === false )
                     {
                            return void 0;
                     }

                     const mtarget: Type<T> = module.target() as Type<T>;
                     let instance: any = module.instance();

                     /** Singleton behaviour if @see module already has instance assigned */
                     if ( instance && options?.singleton !== false )
                     {
                            return instance;
                     }

                     const dependancies: Array<any> = Reflect.getMetadata( "design:paramtypes", mtarget );
                     const propertyMap: Array<PropertyMap<T>> = properties.get( mtarget.name );
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
                                   let lastToken: InjectionToken = void 0;
                                   let isInjected: boolean = false;
                                   let _resolved: T = void 0;

                                   for ( let i = 0; i < plength; ++i )
                                   {
                                          const map: PropertyMap<T> = propertyMap[ i ];

                                          if ( map?.index === index )
                                          {
                                                 isInjected = true;
                                                 lastToken = map.token;

                                                 /** Fetch dependancy based on injected token */
                                                 _resolved = this.resolve( map.token, registry );
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
                                          dependancy = this.resolve( type, registry );
                                   }

                                   if ( !dependancy || ( isInjected && !_resolved ) )
                                   {
                                          this.log?.warn( `Unable to resolve dependancy ${lastToken ? '[' + lastToken + '] ' : ''}[${type}]` );
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
                                   const resolved: any = this.resolve( property.token, registry );

                                   if ( !resolved )
                                   {
                                          continue;
                                   }

                                   instance[ property.key ] = resolved;
                            }
                     }

                     return module.instance( instance );
              }
              catch ( error )
              {
                     this.log?.error( `Resolve Error: [${error.message}]` );
                     return void 0;
              }
       }
}