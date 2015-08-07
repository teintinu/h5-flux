export declare function getCurrentStoreCount(): {
    activeEvents: number;
    activeStores: number;
};
export declare type EventEmmiter<KEY, PAYLOAD> = (key: KEY, payload: PAYLOAD) => void;
export declare type EventListenner<PAYLOAD> = (payload: PAYLOAD) => void;
export declare type EventToggle<KEY, PAYLOAD> = (key: KEY, callback: EventListenner<PAYLOAD>) => void;
export declare type EventRefEmmiter<KEY, PAYLOAD> = {
    emit: EventEmmiter<KEY, PAYLOAD>;
};
export declare type EventRefListenner<KEY, PAYLOAD> = {
    on: EventToggle<KEY, PAYLOAD>;
    off: EventToggle<KEY, PAYLOAD>;
    callback: EventListenner<PAYLOAD>;
};
export interface Event<KEY, PAYLOAD> {
    name: string;
    emit: EventEmmiter<KEY, PAYLOAD>;
    on: EventToggle<KEY, PAYLOAD>;
    off: EventToggle<KEY, PAYLOAD>;
    refEmitter: () => EventRefEmmiter<KEY, PAYLOAD>;
    refListenner: (callback: EventListenner<PAYLOAD>) => EventRefListenner<KEY, PAYLOAD>;
}
export declare function asap(fn: () => void): void;
export declare function createEvent<KEY, PAYLOAD>(name: string): Event<KEY, PAYLOAD>;
export declare function createStore<KEY, INSTANCE>(empty: KEY, instance: INSTANCE): {
    refCount: (key: KEY) => number;
    addRef: (key: KEY) => INSTANCE;
};
export declare type I18N = string;
export declare type Validation<T> = (value: T) => I18N;
export declare enum FieldType {
    String = 0,
    Number = 1,
}
export interface FieldLabels {
    caption: I18N;
    hint: I18N;
}
export interface Field<T> {
    name: string;
    labels: FieldLabels;
    toText(value: T): string;
    fromText(text: string): T;
    validate(value: T): I18N;
    required: boolean;
}
export declare function createField<T>(name: string, labels: FieldLabels, fieldType: FieldType, toText: (value: T) => string, fromText: (text: string) => T, required: boolean, validations?: Validation<T>[]): Field<T>;
export declare function createFieldString(name: string, labels: FieldLabels, required: boolean, min?: number, max?: number, validations?: Validation<string>[]): Field<string>;
export declare function createFieldNumber(name: string, labels: FieldLabels, decimals: number, required: boolean, min?: number, max?: number, validations?: Validation<number>[]): Field<number>;
export declare function createFieldBoolean(name: string, labels: FieldLabels, required: boolean, validations?: Validation<boolean>[]): Field<boolean>;
