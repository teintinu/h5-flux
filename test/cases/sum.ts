import {createAction, createEvent, createStore} from "../../lib/h5flux";

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

export var createSumStore =
    createStore(0,
        {
            ac_sum: ac_sum.addRef()
        },
        [ev_sum_result],
        (state, actions) => {
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
