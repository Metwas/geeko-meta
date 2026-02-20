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

import { ENCODER_INJECTABLE_TOKEN, GET_INJECTABLE_TOKEN } from "./dependancies";
import { describe, it } from "node:test";
import { ModuleWrapper, Reflector } from "../src/main";
import assert from "node:assert/strict";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

describe(`Can get all Injectables for token [${ENCODER_INJECTABLE_TOKEN}]`, () => {
       const injectables: Array<any> | undefined = Reflector.getFor(
              ENCODER_INJECTABLE_TOKEN,
       );

       it("Should at least be one ?", () => {
              assert.ok(injectables && injectables.length > 0);
       });
});

describe(`Can get all Injectables for token [${GET_INJECTABLE_TOKEN}]`, () => {
       const getters: Array<any> | undefined = Reflector.getFor(
              GET_INJECTABLE_TOKEN,
              {
                     isProperty: true,
              },
       );

       it("Should at least be one ?", () => {
              assert.ok(getters && getters.length > 0);
       });
});

describe(`Can get all ModuleWrappers for token [${ENCODER_INJECTABLE_TOKEN}]`, () => {
       const modules: Array<ModuleWrapper<any, any>> | undefined =
              Reflector.getWrapperFor(ENCODER_INJECTABLE_TOKEN);

       it("Should at least be one ?", () => {
              assert.ok(modules && modules.length > 0);
       });
});
