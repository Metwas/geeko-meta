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

import { InjectionToken, MetadataOptions } from "../types";
import { Type } from "../types/Type";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @see Type<T> module factory wrapper interface
 *
 * @public
 */
export class ModuleWrapper<I, T> {
       /**
        * Expects a given type @see Object target reference
        *
        * @public
        * @param {Type<T>} target
        * @param {InjectableOptions} options
        */
       public constructor(
              target: Type<T> | undefined,
              metadata?: any,
              options?: MetadataOptions,
       ) {
              this._injectable = options?.injectable ?? false;

              this.useFactory = options?.useFactory;
              this.useValue = options?.useValue;
              this._token = options?.token;
              this._meta = metadata;
              this._target = target;
       }

       /**
        * Custom injection token name
        *
        * @private
        * @type {String}
        */
       private _token: InjectionToken | undefined = void 0;

       /**
        * Base constructor object/class type
        *
        * @private
        * @type {Type<T>}
        */
       private _target: Type<T> | undefined = void 0;

       /**
        * Module metadata
        *
        * @private
        * @type {Any}
        */
       private _meta: any | undefined = void 0;

       /**
        * @see this._target instance
        *
        * @private
        * @type {I}
        */
       private _instance: I | undefined = void 0;

       /**
        * @see injectable flag
        *
        * @private
        * @type {Boolean}
        */
       private _injectable: boolean = false;

       /**
        * Get/Set the @see Type<T> instance value. This takes priority over @see useFactory
        *
        * @public
        * @type {I}
        */
       public useValue?: I;

       /**
        * Custom factory function to build the instance of @see Type<T>
        *
        * @public
        * @type {Function}
        */
       public useFactory?: (...args: Array<any>) => I;

       /**
        * Flag to indicate if this module is injectable
        *
        * @public
        * @type {Boolean}
        */
       public injectable(): boolean {
              return this._injectable;
       }

       /**
        * Get/Set the target @see Type<T> instance value
        *
        * @public
        * @param {I} override
        * @returns {I}
        */
       public instance(override?: I): I | undefined {
              if (override) {
                     this._instance = override;
              }

              return this._instance;
       }

       /**
        * Get/Set the base object/class @see Type<T>
        *
        * @public
        * @param {Type<T>} override
        * @returns {Type<T>}
        */
       public target(override?: Type<T>): Type<T> | undefined {
              if (override) {
                     this._target = override;
              }

              return this._target;
       }

       /**
        * Gets the @see InjectionToken name or @see Type<T> constructor name
        *
        * @public
        * @returns {InjectionToken | undefined}
        */
       public name(): InjectionToken | undefined {
              return this._token ?? this._target?.name;
       }

       /**
        * Gets the @see metadata
        *
        * @public
        * @returns {Any}
        */
       public metadata(): any {
              return this._meta;
       }
}
