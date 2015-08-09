/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require('chai');
import {createEvent} from "../lib/h5flux";
var expect = chai.expect;

describe('h5-event', () => {

    it('emit/listen', (done) => {
        var e = createEvent<number>("e");
        e.emit(1);
        e.on((payload) => {
            expect(payload, 'payload').to.equals(1);
            done();
        }); 
    });

    it('emit/listen once', (done) => {
        var count = 0;
        var e = createEvent<number>("e")
        e.emit(10);
        e.emit(20);
        e.once((payload) => {
            count++;
            expect(payload, 'unexpected payload').to.equals(10);
        });

        setTimeout(() => {
            expect(count).to.equals(1);
            done();
        }, 25);

    });

    it('emit/listen many', (done) => {
        var count = 0;
        var e = createEvent<number>("e")
        e.emit(10);
        e.emit(20);
        e.on((payload) => {
            count++;
            expect(payload, 'unexpected payload').to.equals(count * 10);
        });

        setTimeout(() => {
            expect(count).to.equals(2);
            done();
        }, 25);

    });

    it('emit/unlisten', (done) => {
        var e = createEvent<number>("e")
        var fn = (payload: number) => {
            expect(payload, 'payload').to.equals(1);
            e.emit(2);
            e.off(fn);
            setTimeout(() => {
                done();
            }, 25);
        };
        e.emit(1);
        e.on(fn);
    });

    it('payload must be an immutable object', (done) => {
        interface Sample {
            value: number,
            sub: { value: number }
        }
        var e = createEvent<Sample>("e")
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
        var e = createEvent<number[]>("e")
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

});
