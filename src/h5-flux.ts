
// TODO PAYLOAD must be immutable

export interface EventEmmiter<KEY, PAYLOAD> {
    emit(key: KEY, payload: PAYLOAD): void
};

export declare type EventListenner<PAYLOAD> = (payload: PAYLOAD) => void;

export interface Event<KEY, PAYLOAD> {
    name: string;
    emitter: EventEmmiter<KEY, PAYLOAD>;
    on(key: KEY, callback: EventListenner<PAYLOAD>): void;
    off(key: KEY, callback: EventListenner<PAYLOAD>): void;
}

export function asap(fn: () => void) {
    setTimeout(fn, 1);
}

export function createEvent<KEY, PAYLOAD>(name: string): Event<KEY, PAYLOAD> {

    // interface IndexedListenners  {
    //   [key: KEY]: EventListenner<KEY, PAYLOAD>;
    // }

    let all_listenners: any = {};

    let emitter: EventEmmiter<KEY, PAYLOAD> = {
        emit: function emitter(key: KEY, payload: PAYLOAD) {
            asap(() => {
                var listenners = getListenners(key, false);
                if (listenners) {
                    if (typeof payload === 'object')
                        payload = Object.freeze<PAYLOAD>(payload);
                    listenners.forEach((listenner) =>
                        asap(() => listenner(payload))
                    )
                }
            });
        }
    };

    function on(key: KEY, callback: EventListenner<PAYLOAD>) {
        var listenners = getListenners(key, true);
        if (listenners.indexOf(callback) == -1)
            listenners.push(callback);
    }

    function off(key: KEY, callback: EventListenner<PAYLOAD>) {
        var listenners = getListenners(key, false);
        if (listenners) {
            var i = listenners.indexOf(callback);
            if (i != -1) {
                listenners.splice(i, 1);
                if (!listenners.length) {
                    delete all_listenners[<any>key];
                }
            }
        }
    }

    function getListenners(key: KEY, canCreate: boolean) {
        var l = all_listenners[<any>key];
        if (!l && canCreate) {
            l = all_listenners[<any>key] = [];
        }
        return <EventListenner<PAYLOAD>[]> l;
    }

    return {
        name,
        emitter,
        on,
        off
    }
}

export interface Store<KEY, DATA, SCHEMA, EVENTEMITERS, EVENTLISTENNERS> {
    name: string;
    refCount: (key: KEY) => number,
    addRef: (key: KEY) => StoreInstance<KEY, DATA, SCHEMA, EVENTEMITERS, EVENTLISTENNERS>,
    releaseRef: (key: KEY) => void;
}

export interface StoreInstance<KEY, DATA, SCHEMA, EVENTEMITERS, EVENTLISTENNERS> {
    key: KEY,
    schema: SCHEMA;
    emitters: EVENTEMITERS,
    listenners: EVENTLISTENNERS
}

export function createStore<KEY, DATA, SCHEMA, EVENTEMITERS, EVENTLISTENNERS>(name: string, newData: ()=>DATA, schema: SCHEMA, emitters: EVENTEMITERS, listenners: EVENTLISTENNERS): Store<KEY, DATA, SCHEMA, EVENTEMITERS, EVENTLISTENNERS> {

    type Instance = StoreInstance<KEY, DATA, SCHEMA, EVENTEMITERS, EVENTLISTENNERS>;
    var instances: any = {};

    return {
        name,
        refCount,
        addRef,
        releaseRef
    };

    function refCount(key: KEY) {
        var instance = instances[<any>key];
        if (instance) {
            return instance.refCount;
        }
        return 0;
    }

    function addRef(key: KEY) {
        var instance = instances[<any>key];
        if (!instance) {
            instances[<any>key] = instance = newInstance();
        }
        return <Instance>(instance.obj);
    }

    function releaseRef(key: KEY) {
        var instance = instances[<any>key];
        if (instance) {
            if (instance.refCount <= 1)
                delete instances[<any>key];
            else
                instance.refCount--;
        }
    }

    function newInstance() {
        return {
            name,
            schema,
            emitters,
            listenners,
            data: newData()
        }
    }
}

export type I18N = string;
export type Validation<T> = (value: T) => I18N;
export enum FieldType { String, Number };
export interface Field<T> {
    name: string;
    toText(value: T): string;
    fromText(text: string): T;
    validate(value: T): I18N;
    required: boolean
}

export function createField<T>(name: string, fieldType: FieldType, toText: (value: T) => string, fromText: (text: string) => T, required: boolean, validations?: Validation<T>[]): Field<T> {
    return {
        name,
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

export function createFieldString(name: string, required: boolean, min?: number, max?: number, validations?: Validation<string>[]) {
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
    return createField(name, FieldType.String, (v: string) => v, (v: string) => v, required, validations);
}

export function createFieldNumber(name: string, decimals: number, required: boolean, min?: number, max?: number, validations?: Validation<number>[]) {
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
    return createField(name, FieldType.Number, toText, fromText, required, validations);

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
