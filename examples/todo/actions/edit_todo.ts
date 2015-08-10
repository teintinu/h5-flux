
import {createAction} from "../../../lib/h5flux";

import {TodoListData, TodoItemData} from "../data/todo";
import {todolist_was_changed} from "../events/todo";

export var editTodo = createAction({
    name: "EDIT_TODO",
    // persist: function(state: TodoListData, text: string) {
    //   return 0;
    // },
    reduce: function(state: TodoListData, payload: { id: number, text: string }) {
        return state.map(todo =>
            todo.id === payload.id ?
                //{ ...todo, text: action.text } :
                { id: todo.id, text: payload.text, marked: todo.marked } :
                todo
        );
    },
    notify: [
        todolist_was_changed
    ]
})
