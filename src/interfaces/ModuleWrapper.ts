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

import { Type } from "../types/Type";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @public
 */
export interface IModuleWrapper<I extends Object, T = Type>
{
       dependancies( override?: Array<any> ): Array<IModuleWrapper<any>>;
       instance( override?: I ): I;
       target( override?: T ): T;
       name(): string | undefined;
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
        * Expects a given type @see Object target reference. Optional dependancies will be associated if Injectable 
        * 
        * @public
        * @param {ContructorType} target 
        * @param {IModuleWrapper<any> | Array<IModuleWrapper<any>>} dependancies 
        */
       public constructor( target: T, dependancies?: IModuleWrapper<any> | Array<IModuleWrapper<any>> )
       {
              this._target = target;

              if ( dependancies )
              {
                     this._dependancies = Array.isArray( dependancies ) ? dependancies : [ dependancies ];
              }
       }

       private _dependancies: Array<IModuleWrapper<any>> = void 0;
       private _instance: I = void 0;
       private _target: T = void 0;

       public injectable: boolean = false;

       public instance( override?: I ): I
       {
              if ( override )
              {
                     this._instance = override;
              }

              return this._instance;
       }

       public target( override?: T ): T
       {
              if ( override )
              {
                     this._target = override;
              }

              return this._target;
       }

       public name(): string | undefined
       {
              return ( this._target as any )?.name;
       }

       public dependancies( override?: Array<any> ): Array<IModuleWrapper<T>>
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