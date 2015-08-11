
import React = require("react");
import {declareView} from "../../../lib/h5flux";
import {TodoStore} from "../stores/todo";
import {TodoListData, TodoItemData} from "../data/todo";

var Header = declareView(
    () => ({
        todo: TodoStore.addRef
    }),
    function(view) {
        return (
            <header className='header'>
            <h1>todos</h1>
            </header>
        );
    }
)

Header

//                <TodoTextInput newTodo={true}
//  onSave={:: this.handleSave}
//                placeholder='What needs to be done?' />


// interface TodoTextInputProps {
//     store
//     text: string,
//     placeholder: string,
//     editing?: boolean,
//     newTodo?: boolean
// }
//
// var TodoTextInput = declareView(
//
//     constructor(props, context) {
//         super(props, context);
//         this.state = {
//             text: this.props.text || ''
//         };
//     }
//
//     handleSubmit(e) {
//         const text = e.target.value.trim();
//         if (e.which === 13) {
//             this.props.onSave(text);
//             if (this.props.newTodo) {
//                 this.setState({ text: '' });
//             }
//         }
//     }
//
//     handleChange(e) {
//         this.setState({ text: e.target.value });
//     }
//
//     handleBlur(e) {
//         if (!this.props.newTodo) {
//             this.props.onSave(e.target.value);
//         }
//     }
//
//     render() {
//         return (
//             <input className={classnames({
//                 edit: this.props.editing,
//                 'new-todo': this.props.newTodo
//             }) }
//             type='text'
//             placeholder={this.props.placeholder}
//             autoFocus='true'
//             value={this.state.text}
//             onBlur={::this.handleBlur}
//     onChange = {::this.handleChange }
//     onKeyDown = {::this.handleSubmit } />
//     );
// }
// }
//
var a = <Header todo={TodoStore.addRef}>
  <div></div>
    </Header>

// function x(e: MouseEvent){
//
// }
//
// var a=<div onClick={x}></div>
