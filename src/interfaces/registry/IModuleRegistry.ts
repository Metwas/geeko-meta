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
import { ModuleWrapper } from "../ModuleWrapper";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @public
 */
export interface IModuleRegistry {
       /**
        * Contains all injectable @see ModuleWrapper instances
        *
        * @public
        * @returns {Map<InjectionToken, ModuleWrapper<any, any>>}
        */
       modules(): Map<InjectionToken, ModuleWrapper<any, any>>;

       /**
        * @see Inject property graph
        *
        * @public
        * @returns {Map<InjectionToken, Array<PropertyMap>>}
        */
       properties(): Map<InjectionToken, Array<PropertyMap<any>>>;

       /**
        * Contains all injectable @see InjectionToken references
        *
        * @public
        * @returns {Map<InjectionToken, Array<InjectionToken>>}
        */
       injectables(): Map<InjectionToken, Array<InjectionToken>>;
}
