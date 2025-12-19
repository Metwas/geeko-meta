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

import { env } from "node:process";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Global environment variable to declare if automatic injection is enabled
 *
 * @public
 * @type {String}
 */
export const ENV_GEEKO_AUTO_INJECT: string = "GEEKO_AUTO_INJECT";

/**
 * Geeko logger level flag
 *
 * @public
 * @type {String}
 */
export const GEEKO_META_LOGGER_LEVEL: string = "GEEKO_META_LOGGER_LEVEL";

/**
 * @public
 * @type {Boolean}
 */
let ENV_AUTO_INJECT_ENABLED: boolean | undefined = void 0;

/**
 * Checks if the automatic injection @see Injectable is enabled
 *
 * @public
 * @returns {Boolean}
 */
export const AUTO_INJECT_ENABLED = function (): boolean {
       if (!ENV_AUTO_INJECT_ENABLED) {
              /** Default to enabled if undefined */
              return (ENV_AUTO_INJECT_ENABLED =
                     env[ENV_GEEKO_AUTO_INJECT] === "0" ? false : true);
       }

       return ENV_AUTO_INJECT_ENABLED;
};
