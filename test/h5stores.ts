/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require('chai');
import {asap, leaks} from "../lib/h5flux";
import {sumStore} from "./cases/sum";
//import {TodoItemStore} from "../examples/todo/stores/todoitem";

var expect = chai.expect;

describe('h5-store', () => {

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


    it('sum 0 + 1 - getState', (done) => {

        var sum_store = sumStore.addRef();
        expect(sum_store.getState(), 'initialState').to.be.equal(0);
        sum_store.sum(1);
        setTimeout(() => {
            expect(sum_store.getState(), 'one added').to.be.equal(1);
            sum_store.releaseRef();
            asap(done);
        }, 1);

    });

    it('sum 0 + 1 - listen', (done) => {

        var sum_store = sumStore.addRef();
        expect(sum_store.getState(), 'initialState').to.be.equal(0);
        sum_store.sum(1);
        sum_store.changed.on(sum_changed);
        function sum_changed(state: number) {

            sum_store.changed.off(sum_changed);
            expect(state, 'one added - arg').to.be.equal(1);

            expect(sum_store.getState(), 'one added').to.be.equal(1);
            sum_store.releaseRef();
            done();

        }
    });

    //sum_store.

    //
    // acao.exec=(r){
    //    return {x}
    // }
    // acao.exec(estoriaref);
    // acao.on()

    // var s = createStore(0, instance);
    // expect(s.refCount(1), 's.refCount').to.equals(0);
    // var ref1 = s.addRef(1);
    // ref1.
    //
    // key = 1;
    // ref1.data().name = "Anne";
    // ref1.data().age = 20;
    // expect(s.refCount(1), 's.refCount 1').to.equals(1);
    // var ref2 = s.addRef(1);
    // expect(s.refCount(1), 's.refCount 2').to.equals(2);
    // expect(ref2.data.name, "ref2.data.name").to.equals("Anne");
    // expect(ref2.data.age, "ref2.data.age").to.equals(20);
    // ref2.data.age = 21;
    // expect(ref1.data.age, "ref1.data.name").to.equals(21);
    // ref1.releaseRef();
    // expect(s.refCount(1), 's.refCount -1').to.equals(1);
    // ref1.releaseRef();
    // expect(s.refCount(1), 's.refCount -1r').to.equals(1);
    // ref2.releaseRef();
    // expect(s.refCount(1), 's.refCount -2').to.equals(0);
    // ref2.releaseRef();
    // expect(s.refCount(1), 's.refCount -2r').to.equals(0);
    // done();

    // it('add a todo', (done) => {
    //     //   var sample = TodoItemStore.addRef();
    //     //sample.
    //     //sample.data.title = "Sample task";
    //     //sample.emitters.todo_was_edited.emit();
    // });
});
