
import {createAction} from "../../../lib/h5flux";

import {TodoListData, TodoItemData} from "../data/todo";
import {todolist_was_changed} from "../events/todo";

export var clearMarked = createAction({
    name: "CLEAR_MARKED",
    // persist: function(state: TodoListData, text: string) {
    //   return 0;
    // },
    reduce: function(state: TodoListData) {
         return state.filter(todo => todo.marked === false);
    },
    notify: [
        todolist_was_changed
    ]
})
