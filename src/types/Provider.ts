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

import { Type } from "./Type";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @see Inject token type
 *
 * @public
 */
export type InjectionToken = string | symbol;

/**
 * @see Injectable options
 *
 * @public
 */
export type InjectableOptions = {
       inject?: Array<Type<any> | InjectionToken>;
       useFactory?: (...args: Array<any>) => any;
       token?: InjectionToken;
       metadata?: any;
       useValue?: any;
};

/**
 * @see Injectable provider context definition
 *
 * @public
 */
export type Provider<T> = InjectionToken | InjectableOptions | Type<T>;
