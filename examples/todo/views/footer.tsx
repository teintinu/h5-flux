//
// import React = require("react");
// import {declareView} from "../../../lib/h5flux";
// import {TodoStore} from "../stores/todo";
// import {TodoListData, TodoItemData} from "../data/todo";
// import {TodoTextInput} from "./todotextinput";
//
//
//
// var Header = declareView(
//     () => ({
//         todo: TodoStore.addRef
//     }),
//     null,null,null,
//     function(view) {
//       return (
//         <footer className='footer'>
//           {this.renderTodoCount()}
//           <ul className='filters'>
//             {[SHOW_ALL, SHOW_UNMARKED, SHOW_MARKED].map(filter =>
//               <li key={filter}>
//                 {this.renderFilterLink(filter)}
//               </li>
//             )}
//           </ul>
//           {this.renderClearButton()}
//         </footer>
//       );
//
//     function renderTodoCount() {
//       const { unmarkedCount } = this.props;
//       const itemWord = unmarkedCount === 1 ? 'item' : 'items';
//
//       return (
//         <span className='todo-count'>
//           <strong>{unmarkedCount || 'No'}</strong> {itemWord} left
//         </span>
//       );
//     }
//
//     function  renderFilterLink(filter) {
//       const title = FILTER_TITLES[filter];
//       const { filter: selectedFilter, onShow } = this.props;
//
//       return (
//         <a className={classnames({ selected: filter === selectedFilter })}
//            style={{ cursor: 'hand' }}
//            onClick={() => onShow(filter)}>
//           {title}
//         </a>
//       );
//     }
//
//     function renderClearButton() {
//       const { markedCount, onClearMarked } = this.props;
//       if (markedCount > 0) {
//         return (
//           <button className='clear-completed'
//                   onClick={onClearMarked} >
//             Clear completed
//           </button>
//         );
//       }
//     }
//     }
//   )
//
//
// export default class Footer extends Component {
//   static propTypes = {
//     markedCount: PropTypes.number.isRequired,
//     unmarkedCount: PropTypes.number.isRequired,
//     filter: PropTypes.string.isRequired,
//     onClearMarked: PropTypes.func.isRequired,
//     onShow: PropTypes.func.isRequired
//   }
//
//   render() {
//
// }
//
// }
