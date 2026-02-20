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

import { ApplicationContext, Reflector } from "../src/main";
import { JsonEncoder, Test } from "./dependancies";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

const context: ApplicationContext | undefined =
       Reflector.createApplicationContext({
              providers: [
                     Test,
                     {
                            token: "JSON_ENCODER",
                            useFactory: () => {
                                   return new JsonEncoder();
                            },
                     },
              ],
       });

const instance: Test | undefined = context?.get(Test);

describe("Application Context", () => {
       it("Can get [Test] class ?", () => {
              assert.ok(instance?.constructor?.name === "Test");
       });

       it("Can get [Test] encoder ?", () => {
              assert.ok(instance?.encoder);
       });

       it("is [Test] JSON encoder ?", () => {
              assert.ok(instance?.encoder?.constructor?.name === "JsonEncoder");
       });
});
