import {createAction, createEvent} from "../../lib/h5flux";

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

// class SumStore extends Store<number>
// {
//     public sum(payload: number) {
//
//     }
// }
