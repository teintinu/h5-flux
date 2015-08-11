
import {defineAction} from "../../../lib/h5flux";

import {TodoListData, TodoItemData} from "../data/todo";
import {todolist_was_changed} from "../events/todo";

export var DeleteTodo = defineAction({
    name: "MARK_TODO",
    // persist: function(state: TodoListData, text: string) {
    //   return 0;
    // },
    reduce: function(state: TodoListData, id: number) {
          return state.filter(todo =>
                    todo.id !== id
              );
    },
    notify: [
        todolist_was_changed
    ]
})
