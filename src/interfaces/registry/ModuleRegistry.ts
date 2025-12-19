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

import { InjectionToken, PropertyMap } from "../../types";
import { IModuleRegistry } from "./IModuleRegistry";
import { ModuleWrapper } from "../ModuleWrapper";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @public
 */
export class ModuleRegistry implements IModuleRegistry {
       /**
        * Contains all injectable @see ModuleWrapper instances
        *
        * @private
        * @type {Map<InjectionToken, ModuleWrapper<any, any>>}
        */
       private _modules: Map<InjectionToken, ModuleWrapper<any, any>> = new Map<
              InjectionToken,
              ModuleWrapper<any, any>
       >();

       /**
        * @see Inject property graph
        *
        * @private
        * @type {Map<InjectionToken, ModuleWrapper<any, any>>}
        */
       private _properties: Map<InjectionToken, Array<PropertyMap<any>>> =
              new Map<InjectionToken, Array<PropertyMap<any>>>();

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
