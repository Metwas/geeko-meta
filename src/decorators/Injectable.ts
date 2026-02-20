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

import { INJECTABLE_TOKEN_KEY } from "../global/injection/inject.tokens";
import { CustomDecorator } from "../types/Decorators";
import { SetMetadata } from "./SetMetadata";
import { MetadataOptions } from "../types";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Sets a @see ClassDecorator to injectable.
 *
 * @public
 * @param {MetadataOptions | String} options
 * @returns {CustomDecorator<T>}
 */
export const Injectable = (
       options?: string | MetadataOptions | any,
): CustomDecorator => {
       let metadata: MetadataOptions = Object.assign(
              typeof options === "string"
                     ? { token: options }
                     : (options ?? {}),
              {
                     injectable: true,
              },
       );

       return SetMetadata(INJECTABLE_TOKEN_KEY, metadata, metadata);
};
