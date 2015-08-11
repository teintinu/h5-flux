import {defineEvent} from "../../../lib/h5flux";
import {TodoListData} from "../data/todo";

export var todolist_was_changed =
    defineEvent<TodoListData>('todoitem_was_changed');
