/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require('chai');
import {asap, leaks, Disposable, ActionReference} from "../lib/h5flux";
import {ac_sum, ev_sum_result} from "./cases/sum";
import {todolist_was_changed} from "../examples/todo/events/todo";
import {TodoListData} from "../examples/todo/data/todo";
import {LoadTodos, TodoListSampleData} from "../examples/todo/actions/load_todos";
import {AddTodo} from "../examples/todo/actions/add_todo";
import {DeleteTodo} from "../examples/todo/actions/delete_todo";
import {EditTodo} from "../examples/todo/actions/edit_todo";
import {MarkTodo} from "../examples/todo/actions/mark_todo";
import {MarkAll} from "../examples/todo/actions/mark_all";
import {ClearMarked} from "../examples/todo/actions/clear_marked";

var expect = chai.expect;

describe('actions', () => {

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

    it('sum 1 + 2 (register)', (done) => {
        var action: any = ac_sum.register;
        var ref_sum = action.addRef() as ActionReference<number,number>;
        ref_sum.dispatch(1, 2);
        ev_sum_result.once((res) => {
            expect(res).to.equals(3);
            ref_sum.releaseRef();
            done();
        })
    });


    it('loadTodos', (done) => {
        var ref = LoadTodos.addRef();
        ref.dispatch([], null);
        todolist_was_changed.once((todos) => {
            expect(todos).to.deep.equal(TodoListSampleData);
            ref.releaseRef();
            done();
        });
    });

    it('addTodo', (done) => {
        var ref = AddTodo.addRef();
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
        var ref = DeleteTodo.addRef();
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
        var ref = EditTodo.addRef();
        var old_text = TodoListSampleData[1].text;
        ref.dispatch(TodoListSampleData, [ 2,  'new task 2' ]);
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
        var ref = MarkTodo.addRef();
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
        var ref = MarkAll.addRef();
        ref.dispatch(TodoListSampleData, null);
        todolist_was_changed.once((todos1) => {
            expect(todos1.length).to.deep.equal(TodoListSampleData.length);
            var all_is_marked = todos1.every((t) => t.marked);
            expect(all_is_marked, 'all_is_marked').to.be.true;

            ref.dispatch(todos1, null);
            todolist_was_changed.once((todos2) => {
                var none_is_marked = todos2.every((t) => !t.marked);
                  expect(none_is_marked, 'none_is_marked').to.be.true;

                ref.releaseRef();
                done();
            });
        });
    });

    it('clearMarked', (done) => {
        var ref = ClearMarked.addRef();
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
