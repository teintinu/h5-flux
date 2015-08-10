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

export var sumStore =
    createStore(0,
        function() {
            return {
                ac_sum: ac_sum.addRef()
            }
        },
        [ev_sum_result],
        function(state, actions) {
            return {
                sum: function(payload: number) {
                    actions.ac_sum.dispatch(state, payload);
                }
            }
        })
