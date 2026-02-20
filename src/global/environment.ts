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
