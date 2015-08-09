var _leaks = 0;

export function leaks(){
  return _leaks;
}

// TODO PAYLOAD must be immutable

export type EventEmmiter<PAYLOAD> = (payload: PAYLOAD) => void;
export type EventListener<PAYLOAD> = (payload: PAYLOAD) => void;

export type EventToggle<PAYLOAD> = (callback: EventListener<PAYLOAD>) => void;

export interface Event<PAYLOAD> {
    name: string;
    emit: EventEmmiter<PAYLOAD>;
    on: EventToggle<PAYLOAD>;
    once: EventToggle<PAYLOAD>;
    off: EventToggle<PAYLOAD>;
}

export function asap(fn: () => void) {
    setTimeout(fn, 1);
}

export function createEvent<PAYLOAD>(name: string): Event<PAYLOAD> {

    // interface IndexedListenners  {
    //   [key: KEY]: EventListenner<KEY, PAYLOAD>;
    // }

    let on_listenners: EventListener<PAYLOAD>[] = [],
        once_listenners: EventListener<PAYLOAD>[] = [];

    var event = <Event<PAYLOAD>>{
        name,
        emit,
        on,
        once,
        off
    }

    if (eventCreated)
        eventCreated.emit({ name, event });

    return event;

    function emit(payload: PAYLOAD) {
        asap(() => {
            if (typeof payload === 'object')
                payload = Object.freeze<PAYLOAD>(payload);
            on_listenners.concat(once_listenners)
                .forEach((listenner) =>
                    asap(() => listenner(payload))
                )
            once_listenners = [];
        });
    };

    function on(callback: EventListener<PAYLOAD>) {
        if (on_listenners.indexOf(callback) == -1)
            on_listenners.push(callback);
    }

    function once(callback: EventListener<PAYLOAD>) {
        if (once_listenners.indexOf(callback) == -1)
            once_listenners.push(callback);
    }

    function off(callback: EventListener<PAYLOAD>) {
        let i = on_listenners.indexOf(callback);
        if (i != -1) {
            on_listenners.splice(i, 1);
        }
        i = once_listenners.indexOf(callback);
        if (i != -1) {
            once_listenners.splice(i, 1);
        }
    }
}

var eventCreated = createEvent
    <{ name: string, event: Event<any> }>
    ('h5-flux-eventCreated');

export interface Reference extends Object {
    releaseRef?: () => void;
}

export interface Disposable<T extends Reference> {
    addRef(): T;
    refCount(): number;
}

export type DisposableCreatorReturn<T extends Reference> = {
    instance: T,
    destructor: () => void
}

export interface DisposableChildren {
    [name: string]: Reference
}

export type DisposableCreator<T extends Reference, CHILDREN extends DisposableChildren> = (children: CHILDREN) => DisposableCreatorReturn<T>;

export function createDisposable<T extends Reference, CHILDREN extends DisposableChildren>(
    children: CHILDREN, creator: DisposableCreator<T, CHILDREN>
): Disposable<T> {
    var object: DisposableCreatorReturn<T>;
    return { addRef, refCount };
    function refCount() {
        return (object && (<any>object).__refCount) || 0;
    }
    function addRef(): T {
        if (!object) {
          _leaks++;
            object = creator(children);
            (<any>object).__refCount = 0;
            object.instance.releaseRef = releaseRef;
        }
        (<any>object).__refCount++;
        function releaseRef() {
            asap(() => {
                if ((<any>object).__refCount <= 1) {
                  var keys = Object.keys(children);
                  for (let i = 0; i < keys.length; i++) {
                      children[keys[i]].releaseRef();
                  }
                    let destructor=(<any>object).destructor;
                    object = undefined;
                    destructor()
                    _leaks--;
                }
                else
                  (<any>object).__refCount--;
            });
        }
        return object.instance;
    }
}

export interface ActionDefinition<STATE, PAYLOAD> {
    name: string;
    reduce(state: STATE, payload: PAYLOAD): STATE;
    notify: Event<STATE>[]
}

export interface ActionReference<STATE, PAYLOAD> extends Reference {
    dispatch(state: STATE, payload: PAYLOAD): void;
}

export interface ActionInstance<STATE, PAYLOAD> extends Disposable<ActionReference<STATE, PAYLOAD>> {
}

export enum ActionStep { reduce, notify };

export function createAction<STATE, PAYLOAD>(action: ActionDefinition<STATE, PAYLOAD>): ActionInstance<STATE, PAYLOAD> {

    interface EV_PAYLOAD {
        step: ActionStep,
        state: STATE,
        payload: PAYLOAD
    }

    return createDisposable({}, createInstance);

    function createInstance(): DisposableCreatorReturn<ActionReference<STATE, PAYLOAD>> {

        var action_event = createEvent<EV_PAYLOAD>(action.name);

        action_event.on(catch_action_events);

        return {
            instance: {
                dispatch: emit_reduce
            },
            destructor: () => {
                action_event.off(catch_action_events);
            }
        }

        function emit_reduce(state: STATE, payload: PAYLOAD) {
            var e = { step: ActionStep.reduce, state, payload };
            action_event.emit(e);
        }

        function catch_action_events(e: EV_PAYLOAD): void {
            if (e.step === ActionStep.reduce)
                return run_reduce(e.state, e.payload);
            if (e.step === ActionStep.notify)
                return do_notify(e.state);
        }

        function run_reduce(state: STATE, payload: PAYLOAD) {
            var new_state = action.reduce(state, payload);
            do_notify(new_state);
        }

        function do_notify(state: STATE) {
            action.notify.forEach((n) => {
                n.emit(state);
            })
        }
    }

}

export abstract class Store<STATE> {
    private _state: STATE;
    private _listeners: EventListener<STATE>[];
    private _change: {
      on: EventToggle<STATE>,
      off: EventToggle<STATE>
    }
    constructor(initialState: STATE) {
        this._state = initialState;
        this._change.on = (listener: EventListener<STATE>)=>{
          if (this._listeners.indexOf(listener)==-1)
            this._listeners.push(listener);
        }
        this._change.off = (listener: EventListener<STATE>)=>{
          let i=this._listeners.indexOf(listener);
          if (i>=0)
            this._listeners.splice(i,1);
        }
    }
    public get state(): STATE {
        return this._state;
    }
    public get change() {
        return this._change;
    }
    protected dispatch<PAYLOAD>(action: ActionReference<STATE, PAYLOAD>, payload: PAYLOAD) {
        action.dispatch(this._state, payload);
    }
    protected listen(event: Event<STATE>) {
        event.on((payload) => {
          this._listeners.forEach((e)=>
            asap(()=>{e(payload)})
          );
        });
    }
}


// export interface Action<PAYLOAD> {
//     dispatxch(payload: PAYLOAD): void;
// }
//
// export function createAction<STATE, PAYLOAD>(name: string, transformer: (state: STATE, PAYLOAD: PAYLOAD) => void) {
//     var action_event = createEvent<PAYLOAD>(name);
//     return {
//         dispatch
//     }
//     function dispatch(payload: PAYLOAD) {
//         action_event.emit(payload);
//     }
// }

// export interface Store<KEY, DATA> {
//   refCount(): number;
//   addRef(key: KEY): StoreRef<KEY, DATA>;
// }
//
// export interface StoreRef<KEY, DATA> {
//     key: KEY;
//       data: DATA;
//
//
// export function createStore<KEY,DATA>(): StoreRef<KEY,DATA> {
//
//     type InternalInstance = { refCount: number, data: any };
//
//     var instances: any = {};
//
//     return {
//         refCount,
//         addRef
//     };
//
//     function refCount(key: KEY) {
//         var instance = <InternalInstance>instances[<any>key];
//         if (instance) {
//             if (instance.refCount < 1)
//                 return -1;
//             return instance.refCount;
//         }
//         return 0;
//     }
//
//     function addRef(key: KEY,data:DATA): StoreRef<KEY,DATA> {
//         if (typeof key === "Object")
//             key = Object.freeze<KEY>(key);
//         var instance = <InternalInstance>(instances[<any>key]);
//         if (!instance) {
//             activeStores++;
//             instance = createInstance();
//             instances[<any>key] = instance;
//         }
//         return createRef(instance);
//
//         function createInstance() {
//
//             var instance: InternalInstance = {
//                 refCount: 0,
//                 data: undefined,
//                 emit: createEmitters(),
//                 listen: createListenners()
//             }
//
//             return instance;
//
//             function createEmitters() {
//                 var keys = Object.keys(emit);
//                 var emitters: any = {};
//                 for (var i = 0; i < keys.length; i++) {
//                     var k = keys[i];
//                     var refEmit = <EventRefEmmiter<KEY,any>>emit[k];
//                     emitters[k] = () => refEmit.emit(key, instance.data);
//                 }
//                 return emitters;
//             }
//
//             function createListenners() {
//                 var keys = Object.keys(listen);
//                 var listenners: any = {};
//                 for (var i = 0; i < keys.length; i++) {
//                     var k = keys[i];
//                     var {on, off, callback} = <EventRefListenner<KEY,any>>listen[k];
//                     on(key, callback);
//                     listenners[k] = () => off(key, callback);
//                 }
//                 return listenners;
//             }
//         }
//
//         function destroyInstance() {
//             var listen = instances[<any>key].listen;
//             delete instances[<any>key];
//             var keys = Object.keys(listen);
//             for (var i = 0; i < keys.length; i++) {
//                 var off = listen[keys[i]];
//                 off();
//             }
//             activeStores--;
//         }
//
//         function createRef(instance: InternalInstance): INSTANCE {
//             var active = true;
//             instance.refCount++;
//             return <INSTANCE><any>{
//                 key,
//                 data: data,
//                 schema: schema,
//                 emit: instance.emit,
//                 listen: instance.listen,
//                 releaseRef: () => {
//                     if (active) {
//                         if (instance.refCount <= 1) {
//                             destroyInstance();
//                         }
//                         else
//                             instance.refCount--;
//                         active = false;
//                     }
//                 }
//             };
//         }
//     }
//
//     function checkStoreInstance() {
//         // TODO
//     }
// }

export type I18N = string;
export type Validation<T> = (value: T) => I18N;
export enum FieldType { String, Number };
export interface FieldLabels {
    caption: I18N,
    hint: I18N
}

export interface Field<T> {
    name: string;
    labels: FieldLabels,
    toText(value: T): string;
    fromText(text: string): T;
    validate(value: T): I18N;
    required: boolean
}

export function createField<T>(name: string, labels: FieldLabels, fieldType: FieldType, toText: (value: T) => string, fromText: (text: string) => T, required: boolean, validations?: Validation<T>[]): Field<T> {
    return {
        name,
        labels,
        toText,
        fromText,
        required,
        validate
    };

    function validate(value: T): I18N {
        if (required && !value)
            return "Preenchimento obritatório";
        for (var i = 0; i < validations.length; i++) {
            var msg = validations[i](value);
            if (msg)
                return msg;
        }
        return;
    }
}

export function createFieldString(name: string, labels: FieldLabels, required: boolean, min?: number, max?: number, validations?: Validation<string>[]) {
    validations = validations || [];
    if (min)
        validations.unshift(
            (value: string) => {
                if (value && value.length < min)
                    return "Preenchimento mínimo de " + min + " caracteres";
            }
        )
    if (max)
        validations.unshift(
            (value: string) => {
                if (value && value.length > max)
                    return "Preenchimento máximo de " + max + " caracteres";
            }
        )
    return createField(name, labels, FieldType.String, (v: string) => v, (v: string) => v, required, validations);
}


export function createFieldNumber(name: string, labels: FieldLabels, decimals: number, required: boolean, min?: number, max?: number, validations?: Validation<number>[]) {
    validations = validations || [];
    if (min)
        validations.unshift(
            (value: number) => {
                if (value && value < min)
                    return "O mínimo é " + toText(min);
            }
        )
    if (max)
        validations.unshift(
            (value: number) => {
                if (value && value > max)
                    return "O máximo é " + toText(max);
            }
        )
    return createField(name, labels, FieldType.Number, toText, fromText, required, validations);

    function toText(value: number): string {
        if (!value)
            return;
        return value.toString()
    }
    function fromText(text: string): number {
        if (!text)
            return;
        if (decimals == 0)
            return parseInt(text)
        return parseFloat(text);
    }
}

export function createFieldBoolean(name: string, labels: FieldLabels, required: boolean, validations?: Validation<boolean>[]) {
    validations = validations || [];
    return createField(name, labels, FieldType.Number, toText, fromText, required, validations);

    function toText(value: boolean): string {
        if (value === true)
            return <I18N>'Sim';
        if (value === false)
            return <I18N>'Não';
        return "";
    }

    function fromText(text: string): boolean {
        return text && /s(im)?/i.test(text);
    }
}
