import {createStore} from "../../../lib/h5flux.d";
import {loadTodos} from "../actions/load_todos";
import {addTodo} from "../actions/add_todo";
import {TodoListData, TodoItemData} from "../data/todo";
import {todolist_was_changed} from "../events/todo";

export var TodoStore = createStore(<TodoListData>[],
    function() {
        return {
            loadTodos: loadTodos.addRef(),
            addTodo: addTodo.addRef()
        }
    },
    [todolist_was_changed],
    function(state, actions) {
        return {
            load: function(query?: string) {
                actions.loadTodos.dispatch(state, query);
            },
            addTodo: function(text: string) {
                actions.addTodo.dispatch(state, text);
            }
        }
    })
