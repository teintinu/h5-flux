/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require('chai');
import {asap, leaks, defineEvent} from "../lib/h5flux";
import {todolist_was_changed} from "../examples/todo/events/todo";
import {TodoListData} from "../examples/todo/data/todo";

var expect = chai.expect;

describe('events', () => {

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

    it('emit/listen', (done) => {
        var e = defineEvent<number>("e");
        e.emit(1);
        e.on((payload) => {
            expect(payload, 'payload').to.equals(1);
            done();
        });
    });

    it('emit/listen once', (done) => {
        var count = 0;
        var e = defineEvent<number>("e")
        e.emit(10);
        e.emit(20);
        e.once((payload) => {
            count++;
            expect(payload, 'unexpected payload').to.equals(10);
        });

        asap(() => {
            asap(() => {
                expect(count).to.equals(1);
                done();
            });
        });

    });

    it('emit/listen many', (done) => {
        var count = 0;
        var e = defineEvent<number>("e")
        e.emit(10);
        e.emit(20);
        e.on((payload) => {
            count++;
            expect(payload, 'unexpected payload').to.equals(count * 10);
        });

        asap(() => {
            asap(() => {
                expect(count).to.equals(2);
                done();
            });
        });

    });

    it('emit/unlisten', (done) => {
        var e = defineEvent<number>("e")
        var fn = (payload: number) => {
            expect(payload, 'payload').to.equals(1);
            e.emit(2);
            e.off(fn);
            asap(() => {
                done();
            });
        };
        e.emit(1);
        e.on(fn);
    });

    it('emit/unlisten once', (done) => {
        var e = defineEvent<number>("e")
        e.once(fn);
        e.off(fn);

        setTimeout(function(){
            done();
        }, 10);

        function fn(payload: number){
            expect('event').to.be.eq('not been emitted');
        }
    });

    it('payload must be an immutable object', (done) => {
        interface Sample {
            value: number,
            sub: { value: number }
        }
        var e = defineEvent<Sample>("e")
        e.emit({ value: 1, sub: { value: 2 } });
        e.on((payload) => {
            expect(payload.value, 'payload').to.equals(1);
            payload.value = 10;
            expect(payload.value, 'payload').to.equals(1);
            // TODO
            // payload.sub.value = 20;
            // expect(payload.sub.value, 'payload').to.equals(2);
            payload.sub = { value: 30 };
            expect(payload.sub.value, 'payload').to.equals(2);
            done();
        });
    });

    it('payload must be an immutable array', (done) => {
        var e = defineEvent<number[]>("e")
        e.emit([1, 2]);
        e.on((payload) => {
            expect(payload, 'payload').to.deep.equal([1, 2]);
            expect(() => {
                payload.push(3);
            }).to.throw(/Cannot add\/remove sealed array elements/);
            //expect(()=>{
            payload.slice(0, 1);
            //}).to.throw(/Cannot add\/remove sealed array elements/);
            expect(payload, 'payload').to.deep.equal([1, 2]);
            done();
        });
    });

    it('todolist_was_changed', (done) => {
        var payload: TodoListData = [{ id: 1, text: "todo 1", marked: false }];
        todolist_was_changed.emit(payload);

        todolist_was_changed.once((payload) => {
            expect(payload[0].text).to.equal('todo 1');
            expect(payload[0].marked).to.be.false;
            done();
        });
    });

});
