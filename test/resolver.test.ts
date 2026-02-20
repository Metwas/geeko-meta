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

import { ModuleWrapper, Reflector } from "../src/main";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Test } from "./dependancies";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

describe("Can get wrapper [Test]", () => {
       const wrapper: ModuleWrapper<any, Test> | undefined =
              Reflector.getWrapper(Test);
       it("Wrapper target OK ?", () => {
              assert.ok(wrapper?.target()?.name === "Test");
       });
});

describe("Auto inject for [Test]", () => {
       const instance: Test | undefined = Reflector.get(Test);

       it("Instance OK ?", () => {
              assert.ok(instance?.constructor.name === "Test");
       });

       it("Subclass Instance OK ?", () => {
              assert.ok(typeof instance?.encoder?.encode === "function");
       });
});
