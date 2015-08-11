import {defineAction} from "../../../lib/h5flux";

import {TodoListData, TodoItemData} from "../data/todo";
import {todolist_was_changed} from "../events/todo";

export var LoadTodos = defineAction({
    name: "LOAD_TODOS",
    reduce: function(state: TodoListData) {
        return TodoListSampleData;
    },
    notify: [
        todolist_was_changed
    ]
});

export var TodoListSampleData: TodoListData = [
    { id: 1, text: "Todo 1", marked: false },
    { id: 2, text: "Todo 2", marked: true },
    { id: 3, text: "Todo 3", marked: false },
]
