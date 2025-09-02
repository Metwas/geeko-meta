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


/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @public
 */
export interface IModuleWrapper
{
       dependancies: Array<IModuleWrapper>;
       useFactory?: Function;
       injectable?: boolean;
       reference: Object;
       instance: Object;
       useValue?: any;
}

/**
 * @public
 */
export class ModuleWrapper implements IModuleWrapper
{
       /**
        * Expects a given type @see Object target reference. Optional dependancies will be associated if Injectable 
        * 
        * @public
        * @param {Object} target 
        * @param {IModuleWrapper | Array<IModuleWrapper>} dependancies 
        */
       public constructor( constructor: any, dependancies?: IModuleWrapper | Array<IModuleWrapper> )
       {
              this._constructor = constructor;

              if ( dependancies )
              {
                     this._dependancies = Array.isArray( dependancies ) ? dependancies : [ dependancies ];
              }
       }

       protected _dependancies: Array<IModuleWrapper> = null;
       protected _injectable: boolean = false;
       protected _constructor: Object = null;
       protected _instance: Object = null;

       public get injectable(): boolean
       {
              return this._injectable;
       }

       public get reference(): Object
       {
              return this._constructor;
       }

       public get instance(): Object
       {
              return this._instance;
       }

       public set instance( value: any )
       {
              this._instance = value;
       }

       public get dependancies(): Array<IModuleWrapper>
       {
              return this._dependancies;
       }
}