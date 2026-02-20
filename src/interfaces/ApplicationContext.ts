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

import { IModuleRegistry } from "./registry/IModuleRegistry";
import { IResolver } from "./resolvers/IResolver";
import { InjectionToken, Type } from "../types";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Default @see IApplicationContext implementation
 *
 * @public
 */
export class ApplicationContext {
       /**
        * Expects @see IModuleRegistry instance
        *
        * @public
        * @param {IModuleRegistry} registry
        * @param {IResolver} resolver
        */
       public constructor(
              public readonly registry: IModuleRegistry,
              public readonly resolver: IResolver,
       ) {}

       /**
        * Resolves the @see T from the specified @see InjectionToken or @see Type<T>
        *
        * @public
        * @param {InjectionToken | Type<T>} target
        * @returns {T | undefined}
        */
       public get<T>(target: InjectionToken | Type<T>): T | undefined {
              return this.resolver.resolve(target, this.registry);
       }

       /**
        * Resolves the @see T metadata from the specified @see InjectionToken or @see Type<T>
        *
        * @public
        * @param {InjectionToken | Type<T>} target
        * @returns {Any | undefined}
        */
       public getMetadata<T>(
              target: InjectionToken | Type<T>,
       ): any | undefined {
              return this.resolver.getMetadata(target, this.registry);
       }
}
