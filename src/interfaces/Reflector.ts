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
       InjectableOptions,
       InjectionToken,
       ModuleContext,
       PropertyMap,
       Provider,
       Type,
} from "../types";

import { GEEKO_META_LOGGER_LEVEL } from "../global/environment";
import { DefaultResolver } from "./resolvers/DefaultResolver";
import { IModuleRegistry } from "./registry/IModuleRegistry";
import { ModuleRegistry } from "./registry/ModuleRegistry";
import { ApplicationContext } from "./ApplicationContext";
import { LogLevel, LogService } from "@geeko/log";
import { IResolver } from "./resolvers/IResolver";
import { ModuleWrapper } from "./ModuleWrapper";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Global @see ModuleWrapper registry service
 *
 * @public
 */
export class Reflector {
       /**
        * Default module resolver for this @see Reflector interface
        *
        * @private
        * @type {IResolver}
        */
       private static _resolver: IResolver | undefined = void 0;

       /**
        * Default module resolver for this @see Reflector interface
        *
        * @private
        * @type {Resolver}
        */
       private static _registry: IModuleRegistry | undefined = void 0;

       /**
        * Default logger
        *
        * @private
        * @type {LogService}
        */
       private static _log: LogService | undefined = void 0;

       /**
        * Ready state
        *
        * @private
        * @type {Boolean}
        */
       private static _ready: boolean = false;

       /**
        * Registers the @see ModuleWrapper instance to the global @see ModuleContainer
        *
        * @public
        * @param {String} key
        * @param {ModuleWrapper<I, T>} wrapper
        */
       public static register<I, T>(
              key: string,
              wrapper: ModuleWrapper<I, T>,
       ): void {
              if (!wrapper) {
                     return void 0;
              }

              if (Reflector.ready() === false) {
                     return void 0;
              }

              const injectables:
                     | Map<InjectionToken, Array<InjectionToken>>
                     | undefined = Reflector._registry?.injectables();

              const modules:
                     | Map<InjectionToken, ModuleWrapper<I, T>>
                     | undefined = Reflector._registry?.modules();

              /** Key is the Injector token */
              const existing: Array<InjectionToken> | undefined =
                     injectables?.get(key);

              let isArray: boolean = Array.isArray(existing);
              let name: InjectionToken | undefined = wrapper.name();

              if (
                     !name ||
                     (name &&
                            isArray &&
                            existing &&
                            existing.indexOf(name) > -1)
              ) {
                     /** Already registered injectable of type @see T */
                     return void 0;
              }

              if (wrapper.injectable === true) {
                     if (isArray === false) {
                            injectables?.set(key, [name]);
                     } else if (existing) {
                            existing.push(name);
                     }
              }

              modules?.set(name, wrapper);
       }

       /**
        * Registers @see Inject properties for a given @see Type<T> target
        *
        * @public
        * @param {PropertyMap} property
        */
       public static registryProperty<T>(property: PropertyMap<T>): void {
              if (!property?.target?.name || !property.token) {
                     return void 0;
              }

              if (Reflector.ready() === false) {
                     return void 0;
              }

              const properties:
                     | Map<InjectionToken, Array<PropertyMap<any>>>
                     | undefined = Reflector._registry?.properties();

              const name: string = property.target.name;
              const existing: Array<PropertyMap<T>> | undefined =
                     properties?.get(name);

              if (!existing) {
                     properties?.set(name, [property]);
                     return void 0;
              }

              existing.push(property);
       }

       /**
        * Attempts to resolve the instance of the given @see Type<T> target
        *
        * @public
        * @param {InjectionToken | Type<T>} token
        * @returns {T | undefined}
        */
       public static get<T = new () => void>(
              token: InjectionToken | Type<T>,
       ): T | undefined {
              if (Reflector.ready() === false || !Reflector._registry) {
                     return void 0;
              }

              return Reflector._resolver?.resolve(token, Reflector._registry);
       }

       /**
        * Attempts to resolve the metadata of the given @see Type<T> target
        *
        * @public
        * @param {InjectionToken | Type<T>} token
        * @returns {Any | undefined}
        */
       public static getMetadata<T = new () => void>(
              token: InjectionToken | Type<T>,
       ): any | undefined {
              if (Reflector.ready() === false || !Reflector._registry) {
                     return void 0;
              }

              return Reflector._resolver?.getMetadata(
                     token,
                     Reflector._registry,
              );
       }

       /**
        * Gets all @see ModuleWrapper(s) from the given @see Injectable key
        *
        * @public
        * @param {InjectionToken} key
        * @returns {Array<unknown> | undefined}
        */
       public static getFor(key: InjectionToken): Array<unknown> | undefined {
              const injectables:
                     | Map<InjectionToken, Array<InjectionToken>>
                     | undefined = Reflector._registry?.injectables();

              if (injectables && injectables.has(key)) {
                     const tokens: Array<InjectionToken> | undefined =
                            injectables.get(key);

                     if (!tokens) {
                            return void 0;
                     }

                     const targets: Array<unknown> = [];

                     const length: number = tokens.length;
                     let index: number = 0;

                     for (; index < length; ++index) {
                            const token: InjectionToken = tokens[index];

                            if (!key) {
                                   continue;
                            }

                            const target: unknown = Reflector.get(token);

                            if (target) {
                                   targets.push(target);
                            }
                     }

                     return targets;
              }

              return void 0;
       }

       /**
        * Resolves a new @see ApplicationContext based on the given @see ModuleContext options
        *
        * @public
        * @param {ModuleContext} context
        * @returns {ApplicationContext}
        */
       public static createApplicationContext(
              context: ModuleContext,
              resolver?: IResolver,
       ): ApplicationContext | undefined {
              if (!context) {
                     return void 0;
              }

              const providers: Array<Provider<any>> = context.providers;
              let length: number = providers.length;

              if (length === 0) {
                     return void 0;
              }

              let index: number = 0;

              if (!resolver) {
                     resolver = new DefaultResolver(
                            context.logger ?? Reflector._log,
                     );
              }

              /** Clone default @Inject properties if any, this may be overriden depending on the @see Provider::inject property */
              const properties: Map<
                     InjectionToken,
                     Array<PropertyMap<any>>
              > = new Map(Reflector._registry?.properties());

              const registry: IModuleRegistry = new ModuleRegistry(
                     void 0,
                     properties,
              );

              const modules: Map<
                     InjectionToken,
                     ModuleWrapper<any, any>
              > = registry.modules();

              for (; index < length; ++index) {
                     const provider: Provider<any> = providers[index];
                     let options: InjectableOptions | undefined = void 0;
                     let target: Type<any> | undefined = void 0;

                     if (
                            typeof (provider as InjectableOptions)?.token ===
                            "string"
                     ) {
                            options = {
                                   useFactory: (provider as InjectableOptions)
                                          .useFactory,
                                   useValue: (provider as InjectableOptions)
                                          .useValue,
                                   token: (provider as InjectableOptions).token,
                            };
                     } else if ((provider as Type<any>)?.name) {
                            target = provider as Type<any>;
                     }

                     const wrapper: ModuleWrapper<any, any> = new ModuleWrapper<
                            any,
                            any
                     >(target, void 0, options);

                     const name: InjectionToken | undefined = wrapper.name();

                     if (!name) {
                            this._log?.error(
                                   "Invalid name was provided for the Reflector",
                            );

                            continue;
                     }

                     wrapper.injectable = true;
                     modules.set(name, wrapper);
              }

              return new ApplicationContext(registry, resolver);
       }

       /**
        * Checks and prepares the static @see Reflector defaults
        *
        * @public
        * @returns {Boolean}
        */
       public static ready(): boolean {
              try {
                     if (Reflector._ready === true) {
                            return true;
                     }

                     Reflector._ready = true;

                     if (!Reflector._log) {
                            let logEnv: string | undefined =
                                   process.env[GEEKO_META_LOGGER_LEVEL];

                            if (logEnv !== "0" && logEnv !== "disable") {
                                   if (logEnv === "2" || logEnv === "verbose") {
                                          logEnv = "verbose";
                                   } else if (
                                          logEnv === "3" ||
                                          logEnv === "debug"
                                   ) {
                                          logEnv = "debug";
                                   }

                                   Reflector._log = new LogService({
                                          level: (logEnv as LogLevel) ?? "info",
                                          title: "Reflect",
                                   });
                            }
                     }

                     if (!Reflector._registry) {
                            Reflector.registry(new ModuleRegistry());
                     }

                     if (!Reflector._resolver) {
                            Reflector.resolver(new DefaultResolver(this._log));
                     }

                     return true;
              } catch (error) {
                     return false;
              }
       }

       /**
        * Gets/Sets the @see IResolver reference
        *
        * @public
        * @param {IResolver} override
        * @returns {IResolver | undefined}
        */
       public static resolver(override: IResolver): IResolver | undefined {
              if (override) {
                     Reflector._resolver = override;
              }

              return Reflector._resolver;
       }

       /**
        * Gets/Sets the @see IModuleRegistry reference
        *
        * @public
        * @param {IModuleRegistry} override
        * @returns {IModuleRegistry | undefined}
        */
       public static registry(
              override: IModuleRegistry,
       ): IModuleRegistry | undefined {
              if (override) {
                     Reflector._registry = override;
              }

              return Reflector._registry;
       }
}
