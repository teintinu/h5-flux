import {Action} from "../../../lib/h5flux.d";

import {TodoListData, TodoItemData} from "../data/todo";
import {todolist_was_changed} from "../events/todo";

export var loadTodos : Action<TodoListData,void>= {
    name: "LOAD_TODOS",
    // persist: function(state: TodoListData, text: string) {
    //   return 0;
    // },
    reduce: function(state: TodoListData, payload: void) {
        return samples;
    },
    notify: [
        todolist_was_changed
    ]
}

var samples: TodoListData = [
    { id: 1, text: "Todo 1", marked: false },
    { id: 2, text: "Todo 2", marked: true },
    { id: 3, text: "Todo 3", marked: false },
]
