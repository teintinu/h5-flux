/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require('chai');
import {ac_sum,ev_sum_result} from "./cases/sum";

var expect = chai.expect;

describe('h5-actions', () => {

    it('sum 1 + 2', (done) => {
      var ref_sum = ac_sum.addRef();
      ref_sum.dispatch(1,2);
      ev_sum_result.once((res)=>{
        expect(res).to.equals(3);
        done();
      })
    });

});
