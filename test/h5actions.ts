/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require('chai');
import {asap, leaks} from "../lib/h5flux";
import {ac_sum, ev_sum_result} from "./cases/sum";
import {todolist_was_changed} from "../examples/todo/events/todo";
import {TodoListData} from "../examples/todo/data/todo";
import {loadTodos, TodoListSampleData} from "../examples/todo/actions/load_todos";
import {addTodo} from "../examples/todo/actions/add_todo";
import {deleteTodo} from "../examples/todo/actions/delete_todo";
import {editTodo} from "../examples/todo/actions/edit_todo";
import {markTodo} from "../examples/todo/actions/mark_todo";
import {markAll} from "../examples/todo/actions/mark_all";
import {clearMarked} from "../examples/todo/actions/clear_marked";

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

    it('loadTodos', (done) => {
        var ref = loadTodos.addRef();
        ref.dispatch([], null);
        todolist_was_changed.once((todos) => {
            expect(todos).to.deep.equal(TodoListSampleData);
            ref.releaseRef();
            done();
        });
    });

    it('addTodo', (done) => {
        var ref = addTodo.addRef();
        ref.dispatch([], 'todo 1');
        todolist_was_changed.once((todos) => {
            expect(todos.length).to.equal(1);
            expect(todos[0].text).to.equal("todo 1");
            expect(todos[0].marked).to.false;
            ref.releaseRef();
            done();
        });
    });

    it('deleteTodo', (done) => {
        var ref = deleteTodo.addRef();
        ref.dispatch(TodoListSampleData, 2);
        todolist_was_changed.once((todos) => {
            expect(todos.length, 'len').to.equal(TodoListSampleData.length - 1);
            expect(todos[0], 'todos[0]').to.deep.equal(TodoListSampleData[0]);
            expect(todos[1], 'todos[2]').to.deep.equal(TodoListSampleData[2]);
            ref.releaseRef();
            done();
        });
    });

    it('editTodo', (done) => {
        var ref = editTodo.addRef();
        var old_text = TodoListSampleData[1].text;
        ref.dispatch(TodoListSampleData, { id: 2, text: 'new task 2' });
        todolist_was_changed.once((todos) => {
            expect(todos.length).to.deep.equal(TodoListSampleData.length);
            expect(todos[0]).to.deep.equal(TodoListSampleData[0]);
            expect(todos[2]).to.deep.equal(TodoListSampleData[2]);
            expect(todos[1].id).to.deep.equal(2);
            expect(TodoListSampleData[1].text).to.deep.equal(old_text);
            expect(todos[1].text).to.deep.equal('new task 2');
            expect(todos[1].marked).to.deep.equal(TodoListSampleData[1].marked);
            ref.releaseRef();
            done();
        });
    });

    it('markTodo', (done) => {
        var ref = markTodo.addRef();
        ref.dispatch(TodoListSampleData, 1);
        todolist_was_changed.once((todos) => {
            expect(todos.length).to.deep.equal(TodoListSampleData.length);
            expect(todos[1]).to.deep.equal(TodoListSampleData[1]);
            expect(todos[2]).to.deep.equal(TodoListSampleData[2]);
            expect(TodoListSampleData[0].marked).to.deep.equal(false);
            expect(todos[0].marked).to.deep.equal(true);
            expect(todos[0].id).to.deep.equal(1);
            expect(todos[0].text).to.deep.equal(TodoListSampleData[0].text);
            ref.releaseRef();
            done();
        });
    });


    it('markAll', (done) => {
        var ref = markAll.addRef();
        ref.dispatch(TodoListSampleData, null);
        todolist_was_changed.once((todos) => {
            expect(todos.length).to.deep.equal(TodoListSampleData.length);
            var all_is_marked = todos.every((t) => t.marked);
            expect(all_is_marked, 'all_is_marked').to.be.true;

            ref.dispatch(todos, null);
            todolist_was_changed.once((todos2) => {
                var none_is_marked = todos2.every((t) => !t.marked);
                  expect(none_is_marked, 'none_is_marked').to.be.true;

                ref.releaseRef();
                done();
            });
        });
    });

    it('clearMarked', (done) => {
        var ref = clearMarked.addRef();
        ref.dispatch(TodoListSampleData, null);
        todolist_was_changed.once((todos) => {
            expect(todos.length, 'len').to.equal(TodoListSampleData.length - 1);
            expect(todos[0], 'todos[0]').to.deep.equal(TodoListSampleData[0]);
            expect(todos[1], 'todos[2]').to.deep.equal(TodoListSampleData[2]);
            ref.releaseRef();
            done();
        });
    });
});
