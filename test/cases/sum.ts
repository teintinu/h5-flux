import {defineAction, defineEvent, defineStore} from "../../lib/h5flux";

export var ev_sum_result = defineEvent<number>("sum-result")
export var ac_sum = defineAction({
    name: "sum",
    reduce: function(state: number, amount: number) {
        return state + amount;
    },
    notify: [
        ev_sum_result
    ]
});

export var SumStore =
    defineStore({initialState: 0,
        actions: ()=>({
            sum: ac_sum.register
        }),
        catches: [ev_sum_result]
      }
    )
