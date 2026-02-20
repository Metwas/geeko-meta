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

import { InjectionToken, PropertyMap } from "../../types";
import { IModuleRegistry } from "./IModuleRegistry";
import { ModuleWrapper } from "../ModuleWrapper";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @public
 */
export class ModuleRegistry implements IModuleRegistry {
       /**
        * @public
        * @param {Map<InjectionToken, ModuleWrapper<any, any>>} modules
        * @param {Map<InjectionToken, Array<PropertyMap<any>>>} properties
        */
       public constructor(
              modules?: Map<InjectionToken, ModuleWrapper<any, any>>,
              properties?: Map<InjectionToken, Array<PropertyMap<any>>>,
       ) {
              this._modules =
                     modules ??
                     new Map<InjectionToken, ModuleWrapper<any, any>>();

              this._properties =
                     properties ??
                     new Map<InjectionToken, Array<PropertyMap<any>>>();
       }

       /**
        * Contains all injectable @see ModuleWrapper instances
        *
        * @private
        * @type {Map<InjectionToken, ModuleWrapper<any, any>>}
        */
       private _modules: Map<InjectionToken, ModuleWrapper<any, any>>;

       /**
        * @see Inject property graph
        *
        * @private
        * @type {Map<InjectionToken, ModuleWrapper<any, any>>}
        */
       private _properties: Map<InjectionToken, Array<PropertyMap<any>>>;

       /**
        * Contains all injectable @see InjectionToken references
        *
        * @private
        * @type {Map<InjectionToken, ModuleWrapper<any, any>>}
        */
       private _injectables: Map<InjectionToken, Array<InjectionToken>> =
              new Map<InjectionToken, Array<InjectionToken>>();

       /**
        * Contains all injectable @see ModuleWrapper instances
        *
        * @public
        * @returns {Map<InjectionToken, ModuleWrapper<any, any>>}
        */
       public modules(): Map<InjectionToken, ModuleWrapper<any, any>> {
              return this._modules;
       }

       /**
        * @see Inject property graph
        *
        * @public
        * @returns {Map<InjectionToken, Array<PropertyMap>>}
        */
       public properties(): Map<InjectionToken, Array<PropertyMap<any>>> {
              return this._properties;
       }

       /**
        * Contains all injectable @see InjectionToken references
        *
        * @public
        * @returns {Map<InjectionToken, Array<InjectionToken>>}
        */
       public injectables(): Map<InjectionToken, Array<InjectionToken>> {
              return this._injectables;
       }
}
