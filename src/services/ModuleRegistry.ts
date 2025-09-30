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

import { ModuleContainer } from "../components/containers/ModuleContainer";
import { DiscoveryScanOptions } from "../types/DiscoveryScanOptions";
import { IModuleWrapper } from "../interfaces/ModuleWrapper";
import { Type } from "../types/Type";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

export class ModuleResolver
{
       public resolve<T>( module: IModuleWrapper<T> ): T
       {
              return module.instance();
       }
}

/**
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
       private static _modules: ModuleContainer = new ModuleContainer();
       private static _resolver: ModuleResolver = new ModuleResolver();

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

              if ( isArray === false )
              {
                     this._injectables.set( key, [ name ] );
              }
              else
              {
                     existing.push( name );
              }
              console.log( "Register: ", key, name, wrapper );
              this._modules.set( name, wrapper );
       }

       public static resolveFor<T>( token: string, target: T ): T
       {
              const metadata: any = Reflect.getMetadata( token, target );

              if ( !metadata )
              {
                     return void 0;
              }
       }
}

