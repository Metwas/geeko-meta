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

import { InjectableOptions, InjectionToken } from '../types';
import { Type } from '../types/Type';

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
       public constructor(target: Type<T>, options?: InjectableOptions) {
              this.useFactory = options?.useFactory;
              this.useValue = options?.useValue;
              this._token = options?.token;
              this._target = target;
       }

       /**
        * Custom injection token name
        *
        * @private
        * @type {String}
        */
       private _token: InjectionToken = void 0;

       /**
        * Base constructor object/class type
        *
        * @private
        * @type {Type<T>}
        */
       private _target: Type<T> = void 0;

       /**
        * @see this._target instance
        *
        * @private
        * @type {I}
        */
       private _instance: I = void 0;

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
       public injectable: boolean = false;

       /**
        * Get/Set the target @see Type<T> instance value
        *
        * @public
        * @param {I} override
        * @returns {I}
        */
       public instance(override?: I): I {
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
       public target(override?: Type<T>): Type<T> {
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
}
