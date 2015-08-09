import {createAction, createEvent, Disposable, Event, asap, EventToggle, EventListener, Reference, createDisposable, DisposableChildren} from "../../lib/h5flux";

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
    changed: {
        on: EventToggle<STATE>,
        off: EventToggle<STATE>,
    }
}

export function createStore<STATE, T extends Reference, ACTIONS extends DisposableChildren>(
    initialState: STATE, actions: ACTIONS, catches: Event<STATE>[], createInstance: (state: STATE, action: ACTIONS) => T) {
    return createDisposable(actions, (actions) => {
        var state: STATE = initialState;
        var listenners: EventListener<STATE>[] = [];
        var instance = createInstance(state, actions);
        type INSTANCE = Store<STATE> & typeof instance;
        (<INSTANCE>instance).getState = () => state;
        (<INSTANCE>instance).changed = {
            on: add_listenner,
            off: remove_listenner,
        }
        catches.forEach((e) => e.on(changed));
        return {
            instance: (<INSTANCE>instance),
            destructor: () => {
                catches.forEach((e) => e.off(changed));
            }
        }
        function add_listenner(l: EventListener<STATE>) {
            if (listenners.indexOf(l) == -1)
                listenners.push(l);
        }
        function remove_listenner(l: EventListener<STATE>) {
            var i = listenners.indexOf(l);
            if (i >= 0)
                listenners.splice(i, 1);
        }
        function changed(newState: STATE) {
            state = newState;
            listenners.forEach((l) => asap(() => l(newState)))
        }
    });
}

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
