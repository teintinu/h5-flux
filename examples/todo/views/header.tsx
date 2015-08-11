
import React = require("react");
import {StoreRef, StoreOfState} from "../../../lib/h5flux";
import {TodoStore} from "../stores/todo";
import {TodoListData, TodoItemData} from "../data/todo";

function declareView<STATE extends Object, PROPS extends Object, PRIVATE_METHODS, PUBLIC_METHODS>(
    getPropDefaults: () => PROPS,
    render: (view: STATE | PROPS | PRIVATE_METHODS | PUBLIC_METHODS) => JSX.Element,
    getInitialState: () => STATE = null,
    private_methods: PRIVATE_METHODS = null,
    public_methods: PUBLIC_METHODS = null
) {

    var component = {
        componentWillMount: function() {
            create_view_instance(this);
        },
        componentWillUnmount: function() {
            release_view_instance(this);
        },
        render: function(): JSX.Element {
            return render(getViewState(this));
        }
    };

    var clazz = React.createClass<PROPS, any>(component);
    return clazz;// as ((typeof clazz) | PUBLIC_METHODS);

    function getViewState(self: any) {
        var view = self.view as any;
        (self.view_stores as InternalStore[]).forEach(
            i=> view[i.name] = i.ref.getState()
        );
        return Object.freeze<STATE | PROPS | PRIVATE_METHODS | PUBLIC_METHODS>(view);
    }

    function create_view_instance(self: any) {
        var stores: InternalStore[] = [];
        var view: InternalPair[] = [];
        var references: any[] = []
        var keys = Object.keys(this.props);
        if (getInitialState)
            process_obj(getInitialState());
        process_obj(self.props, getPropDefaults);
        process_method(private_methods);
        process_method(public_methods);

        self.stores = stores;
        self.view = view;
        self.references = references;

        function process_obj(obj: any, defaults_fn?: any) {
            if (obj) {
                var defaults_vals: any;
                Object.keys(obj).forEach((n) => {
                    var m = obj[n];
                    if (m && defaults_vals[n] && defaults_vals[n].releaseRef)
                        defaults_vals[n].releaseRef();
                    if (!m && defaults_fn) {
                        if (!defaults_vals)
                            defaults_vals = defaults_fn();
                        m = defaults_vals[n];
                    }
                    if (m.releaseRef())
                        references.push(m);
                    if (m.getState)
                        stores.push(m);
                    else
                        view[n] = m;
                });
            }
        }

        function process_method(methods: any) {
            if (methods)
                Object.keys(methods).forEach((n) => {
                    var m = methods[n];
                    view[n] = function() {
                        m.apply(view, arguments)
                    }
                });
        }
    }
    function release_view_instance(self: any) {
        self.references.forEach((r: any) => {
            if (r && r.releaseRef)
                r.releaseRef();
        });
    }
    interface InternalPair {
        name: string;
        value: any
    }

    interface InternalStore {
        name: string;
        ref: StoreOfState<any>
    }

}

interface DemoViewProps {
    rowspan: number
}

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
