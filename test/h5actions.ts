/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require('chai');
import {asap, leaks} from "../lib/h5flux";
import {ac_sum, ev_sum_result} from "./cases/sum";

var expect = chai.expect;

describe('h5-actions', () => {

    beforeEach(function(done) {
        asap(() => {
            expect(leaks(), 'before each leaks').to.be.equal(0);
            done();
        })
    });

    afterEach(function(done) {
        asap(() => {
            expect(leaks(), 'after each leaks').to.be.equal(0);
            done();
        })
    });

    it('sum 1 + 2', (done) => {
        var ref_sum = ac_sum.addRef();
        ref_sum.dispatch(1, 2);
        ev_sum_result.once((res) => {
            expect(res).to.equals(3);
            ref_sum.releaseRef();
            done();
        })
    });

});
