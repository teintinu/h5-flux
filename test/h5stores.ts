/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require('chai');
import {asap, leaks} from "../lib/h5flux";
import {SumStore} from "./cases/sum";
import {TodoStore} from "../examples/todo/stores/todo";
import {TodoListData} from "../examples/todo/data/todo";
import {TodoListSampleData} from "../examples/todo/actions/load_todos";

var expect = chai.expect;

describe('stores', () => {

    beforeEach(function(done) {
        setTimeout(() => {
            expect(leaks(), 'before each leaks').to.be.equal(0);
            done();
        }, 1)
    });

    afterEach(function(done) {
        setTimeout(() => {
            expect(leaks(), 'after each leaks').to.be.equal(0);
            done();
        }, 1)
    });


    it('sum 0 + 1 - getState', (done) => {

        var sum_store = SumStore.addRef();
        expect(sum_store.getState(), 'initialState').to.be.equal(0);
        sum_store.sum(1);
        setTimeout(() => {
            expect(sum_store.getState(), 'one added').to.be.equal(1);
            sum_store.releaseRef();
            asap(done);
        }, 1);

    });

    it('sum 0 + 1 - listen', (done) => {

        var sum_store = SumStore.addRef();
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

    it('load todo\'s', (done) => {
        var store = TodoStore.addRef();
        store.loadTodos(void 0)
        store.changed.on((todos) => {
            expect(todos).to.deep.equal(TodoListSampleData);
            store.releaseRef();
            done();
        })
    });

    it('add todo', (done) => {
        var store = TodoStore.addRef();
        store.addTodo("new todo");
        store.changed.on((todos) => {
            expect(todos.length).to.equal(4);
            expect(todos[0].text).to.equal("new todo");
            expect(todos[0].marked).to.false;
            expect(todos[1], 'todos[1]').to.deep.equal(TodoListSampleData[0]);
            expect(todos[2], 'todos[2]').to.deep.equal(TodoListSampleData[1]);
            expect(todos[3], 'todos[3]').to.deep.equal(TodoListSampleData[2]);
            store.releaseRef();
            done();
        })
    });

    it('deleteTodo', (done) => {
        var store = TodoStore.addRef();
        store.deleteTodo(2);
        store.changed.on((todos) => {
            expect(todos.length, 'len').to.equal(TodoListSampleData.length - 1);
            expect(todos[0], 'todos[0]').to.deep.equal(TodoListSampleData[0]);
            expect(todos[1], 'todos[2]').to.deep.equal(TodoListSampleData[2]);
            store.releaseRef();
            done();
        });
    });

    it('editTodo', (done) => {
        var store = TodoStore.addRef();
        var old_text = TodoListSampleData[1].text;
        store.editTodo([2, 'new task 2']);
        store.changed.on((todos) => {
            expect(todos.length).to.deep.equal(TodoListSampleData.length);
            expect(todos[0]).to.deep.equal(TodoListSampleData[0]);
            expect(todos[2]).to.deep.equal(TodoListSampleData[2]);
            expect(todos[1].id).to.deep.equal(2);
            expect(TodoListSampleData[1].text).to.deep.equal(old_text);
            expect(todos[1].text).to.deep.equal('new task 2');
            expect(todos[1].marked).to.deep.equal(TodoListSampleData[1].marked);
            store.releaseRef();
            done();
        });
    });

    it('markTodo', (done) => {
        var store = TodoStore.addRef();
        store.markTodo(1);
        store.changed.on((todos) => {
            expect(todos.length).to.deep.equal(TodoListSampleData.length);
            expect(todos[1]).to.deep.equal(TodoListSampleData[1]);
            expect(todos[2]).to.deep.equal(TodoListSampleData[2]);
            expect(TodoListSampleData[0].marked).to.deep.equal(false);
            expect(todos[0].marked).to.deep.equal(true);
            expect(todos[0].id).to.deep.equal(1);
            expect(todos[0].text).to.deep.equal(TodoListSampleData[0].text);
            store.releaseRef();
            done();
        });
    });


    it('markAll', (done) => {
        var store = TodoStore.addRef();
        store.markAll(void 0);
        store.changed.on(check_if_all_is_marked);
        function check_if_all_is_marked(todos1: TodoListData) {
            store.changed.off(check_if_all_is_marked);
            expect(todos1.length).to.deep.equal(TodoListSampleData.length);
            var all_is_marked = todos1.every((t) => t.marked);
            expect(all_is_marked, 'all_is_marked').to.be.true;
            store.markAll(void 0);
            store.changed.on((todos2) => {
                var none_is_marked = todos2.every((t) => !t.marked);
                expect(none_is_marked, 'none_is_marked').to.be.true;

                store.releaseRef();
                asap(done);
            });
        }
    });

    it('clearMarked', (done) => {
        var store = TodoStore.addRef();
        store.clearMarked(void 0);
        store.changed.on((todos) => {
            expect(todos.length, 'len').to.equal(TodoListSampleData.length - 1);
            expect(todos[0], 'todos[0]').to.deep.equal(TodoListSampleData[0]);
            expect(todos[1], 'todos[2]').to.deep.equal(TodoListSampleData[2]);
            store.releaseRef();
            done();
        });
    });

    it('filterTodo', (done) => {

        var cont = 0;
        var show_query = TodoStore.query.show.addRef();
        show_query.query('unmarked')
        show_query.changed.on((todos_filtered) => {
                expect(todos_filtered.length, 'len-2').to.equal(TodoListSampleData.length - 1);
                expect(todos_filtered[0], 'todos[0]').to.deep.equal(TodoListSampleData[0]);
                expect(todos_filtered[1], 'todos[2]').to.deep.equal(TodoListSampleData[2]);
                show_query.releaseRef();
                done();
        });
    });


});
