//
//
//
// import React = require("react");
// import {declareView, StoreOfState} from "../../../lib/h5flux";
// import {TodoStore} from "../stores/todo";
// import {TodoListData, TodoItemData} from "../data/todo";
//
// function classnames(obj: Object) {
//     return Object.keys(obj).reduce((r, p) => {
//         if (obj[p])
//             r.push(p)
//         return r;
//     }, []).join(' ');
// }
// export interface TodoTextInputProps{
//   item?: TodoItemData;
//   todo?: StoreOfState<TodoListData>,
//   placeholder: string
// }
// export var TodoTextInput = declareView(
//     () => ({
//         item: { id: 0, text: '', marked: false } as TodoItemData,
//         todo: TodoStore.addRef(),
//         placeholder: '',
//     } as TodoTextInputProps),
//     null,
//     null,
//     function(view) {
//         return {
//             handleSubmit: function handleSubmit(e: __React.KeyboardEvent) {
//                 const text = (e.target as any).value.trim();
//                 if (e.which === 13) {
//                     if (view.item.id == 0)
//                         view.todo.addTodo(text);
//                     else
//                         view.todo.editTodo([view.item.id, text]);
//                     view.item.id = 0;
//                     view.item.text = '';
//                 }
//             },
//             handleChange(e: __React.FormEvent) {
//                 const text = (e.target as any).value.trim();
//                 //this.setState({ text: e.target.value });
//             },
//             handleBlur:  (e: __React.FocusEvent) => {
//                 if (!this.props.newTodo) {
//                     const text = (e.target as any).value.trim();
//                     //  this.props.onSave(e.target.value);
//                 }
//             }
//         }
//     },
//     function(view) {
//         return <input
//             className={classnames({
//               'edit': view.item.id > 0,
//               'new-todo': view.item.id == 0
//             }) }
//             type='text'
//             placeholder={view.placeholder}
//             autoFocus={true}
//             value={view.item.text}
//             onBlur={view.handleBlur}
//             onChange = {view.handleChange }
//             onKeyDown = {view.handleSubmit }
//             />
//     }
// )
