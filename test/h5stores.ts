/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require('chai');
import {createFieldString, createFieldNumber} from "../lib/h5flux";
//import {TodoItemStore} from "../examples/todo/stores/todoitem";

var expect = chai.expect;

describe('h5-store', () => {

    it('sum 1 + 1', (done) => {

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
    });

    it('add a todo', (done) => {
        //   var sample = TodoItemStore.addRef();
        //sample.
        //sample.data.title = "Sample task";
        //sample.emitters.todo_was_edited.emit();
    });
});
