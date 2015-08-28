
import {defineAction, GenericActionDefined} from "../../../lib/h5flux";

import {TodoListData, TodoItemData} from "../data/todo";
import {todolist_was_changed} from "../events/todo";

export var AddTodo = defineAction({
    name: "ADD_TODO",
  //  exec: function(state:STATE, [text: string]) {},
    // persist: function(state: TodoListData, text: string) {
    //   return 0;
    // },
    reduce: function(state: TodoListData, text: string) {
      var a=text;
        var item: TodoItemData = {
            id: 0,
            marked: false,
            text: text
        };
        return [item].concat(state);
    },
    notify: [
        todolist_was_changed
    ]
})

var x: GenericActionDefined = AddTodo.register;
