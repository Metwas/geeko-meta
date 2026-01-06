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
