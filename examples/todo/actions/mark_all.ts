
import {defineAction} from "../../../lib/h5flux";

import {TodoListData, TodoItemData} from "../data/todo";
import {todolist_was_changed} from "../events/todo";

export var MarkAll = defineAction({
    name: "MARK_ALL",
    // persist: function(state: TodoListData, text: string) {
    //   return 0;
    // },
    reduce: function(state: TodoListData) {
        const areAllMarked = state.every((todo) => todo.marked);
        return state.map(todo =>
            ({ id: todo.id, text: todo.text, marked: !areAllMarked }))
    },
    notify: [
        todolist_was_changed
    ]
})
