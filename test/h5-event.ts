/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require('chai');
import {createEvent} from "../lib/h5-flux";
var expect = chai.expect;

describe('h5-event', () => {

    it('emit/listen', (done) => {
        var e = createEvent<number, number>("e");
        e.emit(1, 1);
        e.on(1, (payload) => {
            expect(payload, 'payload').to.equals(1);
            done();
        });
    });

    it('emit/listen different key', (done) => {
        var e = createEvent<string, number>("e")
        e.emit("1", 1);
        e.on("2", (payload) => {
            expect(payload, 'unexpected payload').to.equals(1);
        });

        setTimeout(() => {
            done();
        }, 25);

    });

    it('emit/unlisten', (done) => {
        var e = createEvent<number, number>("e")
        var fn = (payload: number) => {
            expect(payload, 'payload').to.equals(1);
            e.emit(1,2);
            e.off(1, fn);
            setTimeout(() => {
                done();
            }, 25);
        };
        e.emit(1,1);
        e.on(1,fn);
    });

    it('payload must be an immutable object', (done) => {
        interface Sample {
            value: number,
            sub: { value: number }
        }
        var e = createEvent<number,Sample>("e")
        e.emit(1,{ value: 1, sub: { value: 2 } });
        e.on(1,(payload) => {
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
        var e = createEvent<number, number[]>("e")
        e.emit(1, [1, 2]);
        e.on(1, (payload) => {
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

});
