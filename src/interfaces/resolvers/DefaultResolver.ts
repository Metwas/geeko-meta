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
                     typeof (token as any)?.name === "string"
                            ? (token as any).name
                            : token;

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

              if (!module || module.injectable() === false) {
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
        * Gets the @see ModuleWrapper specified by token @see InjectionToken OR @see Type<T> from the configured @see IModuleRegistry
        *
        * @public
        * @param {InjectionToken | Type<T>} token
        * @param {IModuleRegistry} registry
        * @returns {ModuleWrapper<any, T> | undefined}
        */
       public getWrapper<T>(
              token: InjectionToken | Type<T>,
              registry: IModuleRegistry,
       ): ModuleWrapper<any, T> | undefined {
              const name: InjectionToken =
                     typeof (token as any)?.name === "string"
                            ? (token as any).name
                            : token;

              if (!registry || !name) {
                     return void 0;
              }

              return registry.modules().get(name);
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
                     typeof (token as any)?.name === "string"
                            ? (token as any).name
                            : token;

              if (!registry || !name) {
                     return void 0;
              }

              const modules: Map<
                     InjectionToken,
                     ModuleWrapper<any, T>
              > = registry.modules();

              return modules.get(name)?.metadata();
       }
}
