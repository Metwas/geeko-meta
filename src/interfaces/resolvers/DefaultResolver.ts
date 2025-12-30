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
export class DefaultResolver implements IResolver {
       /**
        * @public
        * @param {LogService} log
        */
       public constructor(public readonly log?: LogService) {}

       /**
        * Resolves the given token @see InjectionToken OR @see Type<T> from the configured @see IModuleRegistry
        *
        * @public
        * @param {InjectionToken | Type<T>} token
        * @param {IModuleRegistry} registry
        * @param {ResolverOptions} options
        */
       public resolve<T>(
              token: InjectionToken | Type<T>,
              registry: IModuleRegistry,
              options?: ResolverOptions,
       ): T | undefined {
              const name: InjectionToken =
                     typeof token === "function" ? token?.name : token;

              if (!registry || !name) {
                     return void 0;
              }

              const properties: Map<
                     InjectionToken,
                     Array<PropertyMap<any>>
              > = registry.properties();

              const modules: Map<
                     InjectionToken,
                     ModuleWrapper<any, T>
              > = registry.modules();

              const module: ModuleWrapper<any, T> | undefined =
                     modules.get(name);

              if (!module || module.injectable === false) {
                     return void 0;
              }

              const mtarget: Type<T> = module.target() as Type<T>;
              let instance: any = module.instance();

              /** Singleton behaviour if @see module already has instance assigned */
              if (instance && options?.singleton !== false) {
                     return instance;
              }

              let propertyMap: Array<PropertyMap<T>> | undefined = void 0;
              let resolved: Array<any> | undefined = void 0;

              let plength: number = 0;
              let pindex: number = 0;
              let length: number = 0;

              /** Resolve dependancies for @see mtarget */
              if (mtarget) {
                     const dependancies: Array<any> = Reflect.getMetadata(
                            "design:paramtypes",
                            mtarget,
                     );

                     propertyMap = properties.get(mtarget.name);

                     plength = propertyMap?.length ?? 0;
                     length = dependancies?.length ?? 0;

                     if (length > 0) {
                            /** resolve dependancies first- @TODO Attempt to resolve forwardRef or circular dependancies */
                            let index: number = 0;
                            resolved = [];

                            for (; index < length; ++index) {
                                   const type: Type<T> = dependancies[index];
                                   let lastToken: InjectionToken | undefined =
                                          void 0;

                                   let isInjected: boolean = false;
                                   let _resolved: T | undefined = void 0;

                                   if (propertyMap) {
                                          for (; pindex < plength; ++pindex) {
                                                 const map: PropertyMap<T> =
                                                        propertyMap[pindex];

                                                 if (map?.index === index) {
                                                        isInjected = true;
                                                        lastToken = map.token;

                                                        /** Fetch dependancy based on injected token */
                                                        _resolved =
                                                               this.resolve(
                                                                      map.token,
                                                                      registry,
                                                               );
                                                        break;
                                                 }
                                          }

                                          pindex = 0;
                                   }

                                   let dependancy: T | undefined = void 0;

                                   if (isInjected) {
                                          /** Resolve custom module referenced by @see Inject */
                                          dependancy = _resolved;
                                   } else {
                                          dependancy = this.resolve(
                                                 type,
                                                 registry,
                                          );
                                   }

                                   if (
                                          !dependancy ||
                                          (isInjected && !_resolved)
                                   ) {
                                          this.log?.warn(
                                                 `Unable to resolve dependancy ${lastToken ? "[" + String(lastToken) + "] " : ""}[${type}]`,
                                          );
                                   }

                                   resolved.push(dependancy);
                            }
                     }
              }

              if (module.useValue) {
                     instance = module.useValue;
              } else if (typeof module.useFactory === "function") {
                     instance = module.useFactory();
              } else {
                     instance = resolved
                            ? new mtarget(...resolved)
                            : new mtarget();
              }

              if (propertyMap) {
                     /** Resolve @see target injected properties */
                     pindex = 0;

                     for (; pindex < plength; ++pindex) {
                            const property: PropertyMap<T> =
                                   propertyMap[pindex];

                            /** Only resolve property.key */
                            if (typeof property.key === "string") {
                                   const resolved: any = this.resolve(
                                          property.token,
                                          registry,
                                   );

                                   if (!resolved) {
                                          continue;
                                   }

                                   instance[property.key] = resolved;
                            }
                     }
              }

              return module.instance(instance);
       }

       /**
        * Resolves the metadata of the given token @see InjectionToken OR @see Type<T> from the configured @see IModuleRegistry
        *
        * @public
        * @param {InjectionToken | Type<T>} token
        * @param {IModuleRegistry} registry
        * @return {Any | undefined}
        */
       public getMetadata<T>(
              token: InjectionToken | Type<T>,
              registry: IModuleRegistry,
       ): any | undefined {
              const name: InjectionToken =
                     typeof token === "function" ? token?.name : token;

              if (!registry || !name) {
                     return void 0;
              }

              const properties: Map<
                     InjectionToken,
                     Array<PropertyMap<any>>
              > = registry.properties();

              const modules: Map<
                     InjectionToken,
                     ModuleWrapper<any, T>
              > = registry.modules();

              return modules.get(name)?.metadata();
       }
}
