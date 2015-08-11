
import React = require("react");
import {Store} from "../../../lib/h5flux.d";
import {TodoStore} from "../stores/todo";
import {TodoListData, TodoItemData} from "../data/todo";


 function declareView<STATE, PROPS>(getStore: () => Store<STATE>, onRender: (state: STATE, props: PROPS) => JSX.Element) {

    return React.createClass({
      componentWillMount: function() {
          this.store = getStore();
          this.changed.on(() => { this.setState({}) });
      },
      componentWillUnmount: function() {
          this.store.releaseRef();
          var keys = Object.keys(this.props);
          for (var i = 0; i < keys.length; i++) {
            var prop = (this.props as any)[keys[i]];
            if (prop.releaseRef)
                prop.releaseRef();
          }
      },
        render: function(): JSX.Element {
           return onRender(this.store.getState() as STATE, this.props as PROPS);
        }
    });

}
//
// interface DemoViewProps {
//     rowspan: number
// }
//
// var Header = declareView(
//     () => TodoStore.addRef(),
//     function(state: TodoListData, props: DemoViewProps): JSX.Element {
//         return (
//             <header className='header'>
//   <h1>todos</h1>
//   <TodoTextInput newTodo={true}
// //  onSave={:: this.handleSave}
//   placeholder='What needs to be done?' />
//             </header>
//         );
//     }
// )
//  var a = <Header >
//  <div></div>
//      </Header>
