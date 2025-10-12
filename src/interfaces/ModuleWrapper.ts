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

/**_-_-_-_-_-_-_-_-_-_-_-_-_- @Imports _-_-_-_-_-_-_-_-_-_-_-_-_-*/

import { InjectableOptions, InjectionToken } from "../types";
import { Type } from "../types/Type";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @public
 */
export interface IModuleWrapper<I extends Object, T = Type>
{
       dependancies( override?: Array<T> ): Array<T>;
       target( override?: Type<T> ): Type<T>;
       instance( override?: I ): I;
       name(): InjectionToken | undefined;
       resolve(): I;

       useFactory?: Function;
       injectable?: boolean;
       useValue?: T;
}

/**
 * @public
 */
export class ModuleWrapper<I, T> implements IModuleWrapper<I, T>
{
       /**
        * Expects a given type @see Object target reference
        * 
        * @public
        * @param {Type<T>} target
        * @param {InjectableOptions} options
        */
       public constructor( target: Type<T>, options?: InjectableOptions )
       {
              this._target = target;
              this._token = options?.token;
       }

       private _dependancies: Array<T> = void 0;
       private _token: InjectionToken = void 0;
       private _target: Type<T> = void 0;
       private _instance: I = void 0;

       public injectable: boolean = false;

       public instance( override?: I ): I
       {
              if ( override )
              {
                     this._instance = override;
              }

              return this._instance;
       }

       public target( override?: Type<T> ): Type<T>
       {
              if ( override )
              {
                     this._target = override;
              }

              return this._target;
       }

       public name(): InjectionToken | undefined
       {
              return this._token ?? this._target?.name;
       }

       public dependancies( override?: Array<T> ): Array<T>
       {
              if ( override )
              {
                     this._dependancies = override;
              }

              return this._dependancies;
       }

       public resolve(): I
       {
              return void 0;
       }
}