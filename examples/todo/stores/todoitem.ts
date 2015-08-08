// import {dispath} from "../../../lib/h5-flux.d";
//
// import {TodoListData} from "../data/todo";
// import {addTodo} from "../actions/add_todo";
// import {loadTodos} from "../actions/load_todos";
//
// function dispath<STATE,PAYLOAD>(action, state:STATE, payload: PAYLOAD)
// {
//
// }
//
// function todoState(initialState: TodoListData) {
//     var store= {
//         state: initialState,
//         loadTodos: function(){
//            dispath(loadTodos, store.state);
//         },
//         addTodo: function(text: string){
//            dispath(addTodo, store.state, text);
//         }
//     }
//     return store;
// }

// function actions()
// {
//
// }
//
// export class TodoItemStore implements Storef<number,TodoItemData>
// {
//
// };

//
// import {TodoItemData} from "../data/todoitem";
// import {todoitem_was_edited} from "../events/todoitem";
//
// var actions = {
//
// }
//
// var store=createStore2(<Store<typeof schema>>{
//     schema: schema
// });
//
// export default store;

//export var todoItemStore = createStore(<number>null, instance);

// var sample_data: TodoItemData[] = [
//     { title: 'task 1', done: false },
//     { title: 'task 2', done: true },
//     { title: 'task 3', done: false }
// ];
//
// type H5Type<T> = {
//     toString(value: T): string;
//     fromString(text: string): T;
//     validate(value: T): string[];
// };
//
// type H5Field = {
//   name: string,
//   type: H5Type,
// }
//
// function createH5Schema<T>(name: string, fields)
// {
//
// }
//
// var Todo_Item_Schema : H5Schema = {
//     id: h5number(),
//     title: string,
//     done: boolean
// }
//
//
// var Todo_Item_Store = {
//     state: Todo_Item,
//     events: {
//         emit: {
//             todo_was_edited: todo_was_edited.emitter,
//             todo_was_saved: todo_was_saved.emitter
//         },
//         catches: []
//     }
// }
// var instance = {
//     key: <number>0,
//     data: <TodoItemData>null,
//     schema,
//     emit: {
//         todo_was_edited: todoitem_was_edited.refEmitter()
//     },
//     listen: {}
// };
//
