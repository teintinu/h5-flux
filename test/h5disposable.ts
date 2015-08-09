/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require('chai');
import {leaks, createDisposable, Disposable, Reference} from "../lib/h5flux";
var expect = chai.expect;

describe('disposable', () => {

    var initial_leaks: number;
    beforeEach(function() {
        initial_leaks = leaks();
    });

    afterEach(function(done) {
      setTimeout(()=>{
        expect(leaks(), 'leaks').to.be.equal(initial_leaks);
        done();
      },25)
    });

    it('addRef / leak', (done) => {

        interface Data extends Reference {
            x: number
        }

        var count = 0;

        var disposable = createDisposable({}, creator);
        expect(count, 'count').to.deep.equal(0);
        expect(disposable.refCount(), 'refcount').to.deep.equal(0);

        var ref1 = disposable.addRef();
        expect(count, 'count').to.deep.equal(1);
        expect(disposable.refCount(), 'refcount').to.deep.equal(1);
        expect(ref1.x).to.deep.equal(100);
        done();
        initial_leaks++;

        function creator() {
            count++;
            return {
                instance: <Data>{ x: 100 },
                destructor: () => {
                    count--;
                }
            }
        }
    });

    it('addRef/releaseRef', (done) => {

        interface Data extends Reference {
            x: number
        }

        var count = 0;

        var disposable = createDisposable({}, creator);
        expect(count, 'coun1t').to.deep.equal(0);
        expect(disposable.refCount(), 'refcount1').to.deep.equal(0);

        var ref1 = disposable.addRef();
        expect(count, 'count2').to.deep.equal(1);
        expect(disposable.refCount(), 'refcount2').to.deep.equal(1);
        expect(ref1.x).to.deep.equal(100);

        ref1.releaseRef();
        setTimeout(() => {
            expect(count, 'count3').to.deep.equal(0);
            expect(disposable.refCount(), 'refcount3').to.deep.equal(0);

            done();
        }, 12);
        function creator() {
            count++;
            return {
                instance: <Data>{ x: 100 },
                destructor: () => {
                    count--;
                }
            }
        }

    });

    it('addRef/releaseRef two', (done) => {

        interface Data extends Reference {
            x: number
        }

        var count = 0;

        var disposable = createDisposable({}, creator);
        expect(count, 'count1').to.deep.equal(0);
        expect(disposable.refCount(), 'refcount1').to.deep.equal(0);

        var ref1 = disposable.addRef();
        expect(count, 'count2').to.deep.equal(1);
        expect(disposable.refCount(), 'refcount2').to.deep.equal(1);
        expect(ref1.x).to.deep.equal(100);

        var ref2 = disposable.addRef();
        expect(count, 'count3').to.deep.equal(1);
        expect(disposable.refCount(), 'refcount3').to.deep.equal(2);
        expect(ref2.x).to.deep.equal(100);

        ref2.x++;
        expect(ref1.x).to.deep.equal(101);

        ref1.releaseRef();
        setTimeout(() => {
            expect(count, 'count4').to.deep.equal(1);
            expect(disposable.refCount(), 'refcount4').to.deep.equal(1);
            expect(ref2.x).to.deep.equal(101);

            ref2.releaseRef();
            setTimeout(() => {
                expect(count, 'count5').to.deep.equal(0);
                expect(disposable.refCount(), 'refcount5').to.deep.equal(0);
                done();
            }, 12)
        }, 12)

        function creator() {
            count++;
            return {
                instance: <Data>{ x: count*100 },
                destructor: () => {
                    count--;
                }
            }
        }
    });

    it('addRef/releaseRef with children', (done) => {

        interface Data extends Reference {
            x: number
        }

        var count = 0;

        var chield1 = createDisposable({}, function (children) {
            count++;
            return {
                instance: <Data>{ x: count*100},
                destructor: () => {
                    count--;
                }
            }
        });
        expect(count, 'count-chield1').to.deep.equal(0);
        expect(chield1.refCount(), 'parent-refcount1').to.deep.equal(0);
        var chield1_ref = chield1.addRef();
        expect(count, 'count2-chield1').to.deep.equal(1);
        expect(chield1.refCount(), 'refcount2-chield1').to.deep.equal(1);
        expect(chield1_ref.x).to.deep.equal(100);
        chield1_ref.x = 111;

        var chield2 = createDisposable({}, function (children) {
            count++;
            return {
                instance: <Data>{ x: count*100},
                destructor: () => {
                    count--;
                }
            }
        });
        expect(count, 'count-chield2').to.deep.equal(1);
        expect(chield2.refCount(), 'parent-refcount1').to.deep.equal(0);
        var chield2_ref = chield2.addRef();
        expect(count, 'count2-chield2').to.deep.equal(2);
        expect(chield2.refCount(), 'refcount2-chield1').to.deep.equal(1);
        expect(chield2_ref.x).to.deep.equal(200);
        chield2_ref.x = 222;

        var parent = createDisposable({a:chield1_ref, b:chield2_ref}, function (children) {
            count++;
            return {
                instance: <Data>{ x: count*100 +children.a.x+children.b.x},
                destructor: () => {
                    count--;
                }
            }
        });
        expect(count, 'parent.count1').to.deep.equal(2);
        expect(parent.refCount(), 'parent.refcount1').to.deep.equal(0);
        var parent_ref = parent.addRef();
        expect(count, 'parent.count2').to.deep.equal(3);
        expect(parent.refCount(), 'parent.refcount2').to.deep.equal(1);
        expect(parent_ref.x).to.deep.equal(300 + 222 + 111);

        parent_ref.releaseRef();
        setTimeout(() => {
            setTimeout(() => {
                expect(count, 'count5').to.deep.equal(0);
                expect(parent.refCount(), 'refcount5').to.deep.equal(0);
                expect(chield1.refCount(), 'refcount5').to.deep.equal(0);
                expect(chield2.refCount(), 'refcount5').to.deep.equal(0);
                done();
            }, 12)
        }, 12)


    });


});
