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

import { InjectableOptions, InjectionToken } from '../types/Injectable';
import { GEEKO_META_LOGGER_LEVEL } from '../global/environment';
import { DefaultResolver } from './resolvers/DefaultResolver';
import { IModuleRegistry } from './registry/IModuleRegistry';
import { ModuleRegistry } from './registry/ModuleRegistry';
import { ApplicationContext } from './ApplicationContext';
import { PropertyMap } from '../types/PropertyMap';
import { LogLevel, LogService } from '@geeko/log';
import { IResolver } from './resolvers/IResolver';
import { ModuleContext } from '../types/Context';
import { ModuleWrapper } from './ModuleWrapper';
import { Provider } from '../types/Provider';
import { Type } from '../types/Type';

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

              const injectables: Map<
                     InjectionToken,
                     Array<InjectionToken>
              > = Reflector._registry.injectables();
              const modules: Map<
                     InjectionToken,
                     ModuleWrapper<I, T>
              > = Reflector._registry.modules();

              /** Key is the Injector token */
              const existing: Array<InjectionToken> = injectables.get(key);
              let isArray: boolean = Array.isArray(existing);
              let name: InjectionToken = wrapper.name();

              if (name && isArray && existing.indexOf(name) > -1) {
                     /** Already registered injectable of type @see T */
                     return void 0;
              }

              if (wrapper.injectable === true) {
                     if (isArray === false) {
                            injectables.set(key, [name]);
                     } else {
                            existing.push(name);
                     }
              }

              modules.set(name, wrapper);
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

              const properties: Map<
                     InjectionToken,
                     Array<PropertyMap<any>>
              > = Reflector._registry.properties();

              const name: string = property.target.name;
              const existing: Array<PropertyMap<T>> = properties.get(name);

              if (!existing) {
                     properties.set(name, [property]);
                     return void 0;
              }

              existing.push(property);
       }

       /**
        * Attempts to resolve the instance of the given @see Type<T> target
        *
        * @public
        * @param {Type<T>} target
        * @param {InjectableOptions} options
        * @returns {T}
        */
       public static get<T = new () => void>(
              token: InjectionToken | Type<T>,
       ): T {
              if (Reflector.ready() === false) {
                     return void 0;
              }

              return Reflector._resolver.resolve(token, Reflector._registry);
       }

       /**
        * Gets all @see ModuleWrapper(s) from the given @see Injectable key
        *
        * @public
        * @param {InjectionToken} key
        * @returns {Array<unknown>}
        */
       public static getModules(key: InjectionToken): Array<unknown> {
              const injectables: Map<
                     InjectionToken,
                     Array<InjectionToken>
              > = Reflector._registry.injectables();

              if (injectables && injectables.has(key)) {
                     const tokens: Array<InjectionToken> = injectables.get(key);
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
       ): ApplicationContext {
              if (!context || typeof context !== 'object') {
                     return void 0;
              }

              const providers: Array<Provider<any>> = context.providers;

              let length: number = providers.length;

              if (length === 0) {
                     /** Not point doing anything if there are no @see Provider objects */
                     return void 0;
              }

              let index: number = 0;

              const resolver: IResolver = new DefaultResolver(
                     context.logger ?? Reflector._log,
              );
              const registry: IModuleRegistry = new ModuleRegistry();

              for (; index < length; ++index) {
                     const provider: Provider<any> = providers[index];
                     let options: InjectableOptions = void 0;
                     let target: Type<any> = void 0;

                     if (
                            typeof (provider as InjectableOptions)?.token ===
                            'string'
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

                     this._log?.debug(
                            `Creating wrapper: [${target ?? 'Unknown target'}] [${options?.token ?? 'Unknown Token'}]`,
                     );

                     const wrapper: ModuleWrapper<any, any> = new ModuleWrapper<
                            any,
                            any
                     >(target, options);
                     wrapper.injectable = true;

                     registry.modules().set(wrapper.name(), wrapper);
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
                            let logEnv: string =
                                   process.env[GEEKO_META_LOGGER_LEVEL];

                            if (logEnv !== '0' && logEnv !== 'disable') {
                                   if (logEnv === '1' || logEnv === 'true') {
                                          logEnv = 'info';
                                   }

                                   Reflector._log = new LogService({
                                          level:
                                                 (logEnv as LogLevel) ??
                                                 'verbose',
                                          title: 'Reflect',
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
        * @returns {IResolver}
        */
       public static resolver(override: IResolver): IResolver {
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
        * @returns {IModuleRegistry}
        */
       public static registry(override: IModuleRegistry): IModuleRegistry {
              if (override) {
                     Reflector._registry = override;
              }

              return Reflector._registry;
       }
}
