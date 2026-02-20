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

import { IModuleRegistry } from "../registry/IModuleRegistry";
import { InjectionToken, Type } from "../../types";
import { ModuleWrapper } from "../ModuleWrapper";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Core @see IModuleWrapper resolver interface
 *
 * @public
 */
export interface IResolver {
       /**
        * Resolves the given token @see InjectionToken OR @see Type<T> from the configured @see IModuleRegistry
        *
        * @public
        * @param {InjectionToken | Type<T>} token
        * @param {IModuleRegistry} registry
        * @return {T | undefined}
        */
       resolve<T>(
              token: InjectionToken | Type<T>,
              registry: IModuleRegistry,
       ): T | undefined;

       /**
        * Resolves the metadata of the given token @see InjectionToken OR @see Type<T> from the configured @see IModuleRegistry
        *
        * @public
        * @param {InjectionToken | Type<T>} token
        * @param {IModuleRegistry} registry
        * @return {Any | undefined}
        */
       getMetadata<T>(
              token: InjectionToken | Type<T>,
              registry: IModuleRegistry,
       ): any | undefined;

       /**
        * Gets the @see ModuleWrapper specified by token @see InjectionToken OR @see Type<T> from the configured @see IModuleRegistry
        *
        * @public
        * @param {InjectionToken | Type<T>} token
        * @param {IModuleRegistry} registry
        * @returns {ModuleWrapper<any, T> | undefined}
        */
       getWrapper<T>(
              token: InjectionToken | Type<T>,
              registry: IModuleRegistry,
       ): ModuleWrapper<any, T> | undefined;
}
