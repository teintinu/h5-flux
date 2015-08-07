import {createEvent} from "../../../lib/h5-flux.d";
import {TodoItemData} from "../data/todoitem";

/** ocorre sempre que o item for modificado
 mesmo ainda não estando salvo.
 ùtil para permitir edição sincronizada
*/
export var todoitem_was_edited =
  createEvent<number, TodoItemData>('todoitem_was_edited');

//provavelmente não precisa
//export var todoitem_was_saved = createEvent<number, TodoItem>('todoitem_was_edited');
