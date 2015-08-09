// import {Store,createAction, createEvent} from "../../lib/h5flux";
//
// var ev_sum_result = createEvent<number>("sum-result")
// var ac_sum = createAction({
//     name: "sum",
//     reduce: function(state: number, amount: number) {
//         return state + amount;
//     },
//     notify: [
//         ev_sum_result
//     ]
// });
//
// interface StoreActions<STATE>{
// }
//
// interface SumStoreActions extends StoreActions<number>
// {
//   sum(amount: number): void;
// }
//
//
// function createSumStore(initialState: number){
//
// var state = initialState;
// var ac_sum_ref = ac_sum.addRef();
//   var actions = {
//       sum: function (payload: number)  {
//         ac_sum
//         this.dispatch(this.action_sum, payload);
//       }
//   }
//
//
// }
//
//
//
// createStore()
// // //public sum(payload: number)
// // class SumStore extends Store<number>
// // {
// //     private action_sum = ac_sum.addRef();
// //
// // }
