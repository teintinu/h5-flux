import {defineStore, defineQuery} from "../../../lib/h5flux";
import {LoadTodos, TodoListSampleData} from "../actions/load_todos";
import {AddTodo} from "../actions/add_todo";
import {DeleteTodo} from "../actions/delete_todo";
import {EditTodo} from "../actions/edit_todo";
import {MarkTodo} from "../actions/mark_todo";
import {MarkAll} from "../actions/mark_all";
import {ClearMarked} from "../actions/clear_marked";
import {TodoListData, TodoItemData} from "../data/todo";
import {todolist_was_changed} from "../events/todo";

var show = defineQuery(
    (state: TodoListData, query: string) => {
        if (query == 'marked')
            return state.filter((item) => item.marked);
        if (query == 'unmarked')
            return state.filter((item) => !item.marked);
        return state;
    }
);

var count_markeds = defineQuery(
    (todos: TodoListData, query: string) => {
        return todos.reduce(function(ant, item) {
            if (item.marked)
                ant++;
            return ant;
        }, 0)
    }
);

export var TodoStore = defineStore(TodoListSampleData,
    () => ({
        loadTodos: LoadTodos.register,
        addTodo: AddTodo.register,
        deleteTodo: DeleteTodo.register,
        editTodo: EditTodo.register,
        markTodo: MarkTodo.register,
        markAll: MarkAll.register,
        clearMarked: ClearMarked.register,
    }),
    [
        todolist_was_changed
    ],
    {
        /** filter todos by all, marked or unmarked */
        show,
        /** count markeds */
        count_markeds
    }
)
