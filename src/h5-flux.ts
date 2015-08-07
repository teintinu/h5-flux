
var activeEvents = 0;
var activeStores = 0;

export function getCurrentStoreCount() {
    return {
        activeEvents,
        activeStores
    }
}

// TODO PAYLOAD must be immutable

export type EventEmmiter<KEY, PAYLOAD> = (key: KEY, payload: PAYLOAD) => void;

export type EventListenner<PAYLOAD> = (payload: PAYLOAD) => void;
export type EventToggle<KEY, PAYLOAD> = (key: KEY, callback: EventListenner<PAYLOAD>) => void;

export type EventRefEmmiter<KEY, PAYLOAD> = { emit: EventEmmiter<KEY, PAYLOAD> };
export type EventRefListenner<KEY, PAYLOAD> = {
    on: EventToggle<KEY, PAYLOAD>,
    off: EventToggle<KEY, PAYLOAD>,
    callback: EventListenner<PAYLOAD>
};

export interface Event<KEY, PAYLOAD> {
    name: string;
    emit: EventEmmiter<KEY, PAYLOAD>;
    on: EventToggle<KEY, PAYLOAD>;
    off: EventToggle<KEY, PAYLOAD>;
    refEmitter: () => EventRefEmmiter<KEY, PAYLOAD>;
    refListenner: (callback: EventListenner<PAYLOAD>) => EventRefListenner<KEY, PAYLOAD>;
}

export function asap(fn: () => void) {
    setTimeout(fn, 1);
}

export function createEvent<KEY, PAYLOAD>(name: string): Event<KEY, PAYLOAD> {

    // interface IndexedListenners  {
    //   [key: KEY]: EventListenner<KEY, PAYLOAD>;
    // }

    let all_listenners: any = {};

    var event = {
        name,
        emit,
        on,
        off,
        refEmitter,
        refListenner
    }

    return event;

    function emit(key: KEY, payload: PAYLOAD) {
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
                    activeEvents--;
                    delete all_listenners[<any>key];
                }
            }
        }
    }

    function getListenners(key: KEY, canCreate: boolean) {
        var l = all_listenners[<any>key];
        if (!l && canCreate) {
            l = all_listenners[<any>key] = [];
            activeEvents++;
        }
        return <EventListenner<PAYLOAD>[]> l;
    }

    function refEmitter(): EventRefEmmiter<KEY, PAYLOAD> {
        return { emit }
    };

    function refListenner(callback: EventListenner<PAYLOAD>) {
        return { on, off, callback };
    };

}

export function createStore<KEY, INSTANCE>(empty: KEY, instance: INSTANCE) {

    type Finder = (key: KEY, callback: (err: Error, data: any) => void) => void;
    type InternalInstance = { refCount: number, data: any, emit: any, listen: any };

    let finder = <Finder>((<any>instance).finder);
    let schema: any = (<any>instance).schema;
    let emit: any = (<any>instance).emit;
    let listen: any = (<any>instance).listen;

    checkStoreInstance();

    var instances: any = {};

    return {
        refCount,
        addRef
    };

    function refCount(key: KEY) {
        var instance = <InternalInstance>instances[<any>key];
        if (instance) {
            if (instance.refCount < 1)
                return -1;
            return instance.refCount;
        }
        return 0;
    }

    function addRef(key: KEY): INSTANCE {
        if (typeof key === "Object")
            key = Object.freeze<KEY>(key);
        var instance = <InternalInstance>(instances[<any>key]);
        if (!instance) {
            activeStores++;
            instance = createInstance();
            instances[<any>key] = instance;
        }
        return createRef(instance);

        function createInstance() {

            var instance: InternalInstance = {
                refCount: 0,
                data: undefined,
                emit: createEmitters(),
                listen: createListenners()
            }

            return instance;

            function createEmitters() {
                var keys = Object.keys(emit);
                var emitters: any = {};
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i];
                    var refEmit = <EventRefEmmiter<KEY,any>>emit[k];
                    emitters[k] = () => refEmit.emit(key, instance.data);
                }
                return emitters;
            }

            function createListenners() {
                var keys = Object.keys(listen);
                var listenners: any = {};
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i];
                    var {on, off, callback} = <EventRefListenner<KEY,any>>listen[k];
                    on(key, callback);
                    listenners[k] = () => off(key, callback);
                }
                return listenners;
            }
        }

        function destroyInstance() {
            var listen = instances[<any>key].listen;
            delete instances[<any>key];
            var keys = Object.keys(listen);
            for (var i = 0; i < keys.length; i++) {
                var off = listen[keys[i]];
                off();
            }
            activeStores--;
        }

        function createRef(instance: InternalInstance): INSTANCE {
            var active = true;
            instance.refCount++;
            return <INSTANCE><any>{
                key,
                data: () => instance.data,
                finder: finder,
                schema: schema,
                emit: instance.emit,
                listen: instance.listen,
                releaseRef: () => {
                    if (active) {
                        if (instance.refCount <= 1) {
                            destroyInstance();
                        }
                        else
                            instance.refCount--;
                        active = false;
                    }
                }
            };
        }
    }

    function checkStoreInstance() {
        // TODO
    }
}

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
