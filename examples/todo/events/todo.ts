import {createEvent} from "../../../lib/h5flux";
import {TodoListData} from "../data/todo";

export var todolist_was_changed =
    createEvent<TodoListData>('todoitem_was_changed');
