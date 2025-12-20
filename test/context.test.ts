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
