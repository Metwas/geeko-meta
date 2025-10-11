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

import { ModuleContainer } from "../containers/ModuleContainer";
import { IModuleWrapper } from "../../interfaces/ModuleWrapper";
import { Type } from "../../types/Type";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Global @see IModuleWrapper registry
 * 
 * @public
 */
export class ModuleRegistry
{
       /**
        * Global @see ModuleWrapper container
        * 
        * @public
        * @type {ModuleContainer}
        */
       private static _injectables: Map<string, Array<string>> = new Map<string, Array<string>>();

       /**
        * Global static @see ModuleContainer - which contains all injectable @see IModuleWrapper instances
        * 
        * @private
        * @type {ModuleContainer}
        */
       private static _modules: ModuleContainer = new ModuleContainer();

       /**
        * Registers the @see IModuleWrapper instance to the global @see ModuleContainer
        * 
        * @public
        * @param {String} key 
        * @param {IModuleWrapper<I, T>} wrapper 
        */
       public static register<I, T>( key: string, wrapper: IModuleWrapper<I, T> ): void
       {
              if ( !wrapper )
              {
                     return void 0;
              }

              /** Key is the Injector token */
              const existing: Array<string> = this._injectables.get( key );
              let isArray: boolean = Array.isArray( existing );
              let name: string = wrapper.name();

              if ( name && isArray && existing.indexOf( name ) > -1 )
              {
                     /** Already registered injectable of type @see T */
                     return;
              }

              if ( wrapper.injectable === true )
              {
                     if ( isArray === false )
                     {
                            this._injectables.set( key, [ name ] );
                     }
                     else
                     {
                            existing.push( name );
                     }
              }

              this._modules.set( name, wrapper );
       }

       /**
        * Attempts to resolve the instance of the given @see Type<T> target
        * 
        * @public
        * @param {Type<T>} target 
        * @returns {T}
        */
       public static resolve<T = new () => void>( target: Type<T> ): T
       {
              /**@TODO: get name from override options or default to @see Type<T>.name  */
              const name: string = target.name;

              if ( typeof name !== "string" || typeof target !== "function" )
              {
                     return void 0;
              }

              const module: IModuleWrapper<T> = this._modules.get( name );

              if ( !module )
              {
                     return void 0;
              }

              /** Singleton behaviour if @see module already has instance assigned */
              const instance: any = module.instance();

              if ( instance )
              {
                     return instance;
              }

              const dependancies: Array<any> = Reflect.getMetadata( "design:paramtypes", target );
              const length: number = dependancies?.length ?? 0;
              let resolved: Array<any> = [];

              if ( length > 0 )
              {
                     /** resolve dependancies first- @TODO Attempt to resolve forwardRef or circular dependancies */
                     let index: number = 0;

                     for ( ; index < length; ++index )
                     {
                            console.log( dependancies[ index ] );
                            const dependancy: any = this.resolve( dependancies[ index ] );
                            /** @TODO reject if dependancy was not resolved or default */
                            if ( dependancy )
                            {
                                   resolved.push( dependancy );
                            }
                     }
              }

              const newInstance: any = new target( ...resolved );
              module.instance( newInstance );

              return newInstance;
       }
}

