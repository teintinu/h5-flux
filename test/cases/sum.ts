import {createAction, createEvent, Disposable, Reference, createDisposable, DisposableChildren} from "../../lib/h5flux";

export var ev_sum_result = createEvent<number>("sum-result")
export var ac_sum = createAction({
    name: "sum",
    reduce: function(state: number, amount: number) {
        return state + amount;
    },
    notify: [
        ev_sum_result
    ]
});

interface Store<STATE> extends Reference {
    getState(): STATE;
}

export function createStore<STATE, T extends Reference, ACTIONS extends DisposableChildren>(
    initialState: STATE, actions: ACTIONS, createInstance: (state: STATE, action: ACTIONS) => T) {
    return createDisposable(actions, (actions) => {
        var state: STATE = initialState;
        var instance = createInstance(state, actions);
        type INSTANCE = Store<STATE> & typeof instance ;
        (<INSTANCE>instance).getState = () => state;
        return {
            instance: (<INSTANCE>instance),
            destructor: () => { }
        }
    });
}

export var createSumStore = createStore(0, {
    ac_sum: ac_sum.addRef()
}, (state, actions) => {
    return {
        sum: function(payload: number) {
            actions.ac_sum.dispatch(state, payload);
        }
    }
})
// function createSumStore(initialState: number) {
//     return createDisposable({
//         ac_sum: ac_sum.addRef()
//     }, (actions) => {
//         var state = initialState;
//         return {
//             instance: {
//                 sum: function(payload: number) {
//                     actions.ac_sum.dispatch(state,payload);
//                 }
//             },
//             destructor: () => { }
//         }
//     }
//     );
// }
