/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require('chai');
import {createStore, createFieldString, createFieldNumber} from "../lib/h5-flux";
var expect = chai.expect;

describe('h5-event', () => {

    it('1', (done) => {

        interface Data {
            name: string;
            age: number
        }
        var schema = {
            name: createFieldString("Nome", true),
            age: createFieldNumber("Age", 0, true, 0)
        };
        function createData(): Data{
           return <Data>{};
        }

        var s = createStore("e", createData, schema, {}, {});
        expect(s.refCount(1), 's.refCount').to.equals(0);
        var r = s.acquire(1);
        expect(s.refCount, 's.refCount').to.equals(0);
        done();
    });

});
