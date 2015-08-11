
import {defineAction} from "../../../lib/h5flux";

import {TodoListData, TodoItemData} from "../data/todo";
import {todolist_was_changed} from "../events/todo";

export var EditTodo = defineAction({
    name: "EDIT_TODO",
    // persist: function(state: TodoListData, text: string) {
    //   return 0;
    // },
    reduce: function(state: TodoListData, [ id, text ]: [number,string]) {
        return state.map(todo =>
            todo.id === id ?
                //{ ...todo, text: action.text } :
                { id: todo.id, text: text, marked: todo.marked } :
                todo
        );
    },
    notify: [
        todolist_was_changed
    ]
})
