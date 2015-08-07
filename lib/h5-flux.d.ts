export interface EventEmmiter<KEY, PAYLOAD> {
    emit(key: KEY, payload: PAYLOAD): void;
}
export declare type EventListenner<PAYLOAD> = (payload: PAYLOAD) => void;
export interface Event<KEY, PAYLOAD> {
    name: string;
    emitter: EventEmmiter<KEY, PAYLOAD>;
    on(key: KEY, callback: EventListenner<PAYLOAD>): void;
    off(key: KEY, callback: EventListenner<PAYLOAD>): void;
}
export declare function asap(fn: () => void): void;
export declare function createEvent<KEY, PAYLOAD>(name: string): Event<KEY, PAYLOAD>;
export interface Store<KEY, DATA, SCHEMA, EVENTEMITERS, EVENTLISTENNERS> {
    name: string;
    refCount: (key: KEY) => number;
    acquire: (key: KEY) => StoreInstance<KEY, DATA, SCHEMA, EVENTEMITERS, EVENTLISTENNERS>;
    release: (key: KEY) => void;
}
export interface StoreInstance<KEY, DATA, SCHEMA, EVENTEMITERS, EVENTLISTENNERS> {
    key: KEY;
    schema: SCHEMA;
    emitters: EVENTEMITERS;
    listenners: EVENTLISTENNERS;
}
export declare function createStore<KEY, DATA, SCHEMA, EVENTEMITERS, EVENTLISTENNERS>(name: string, newData: () => DATA, schema: SCHEMA, emitters: EVENTEMITERS, listenners: EVENTLISTENNERS): Store<KEY, DATA, SCHEMA, EVENTEMITERS, EVENTLISTENNERS>;
export declare type I18N = string;
export declare type Validation<T> = (value: T) => I18N;
export declare enum FieldType {
    String = 0,
    Number = 1,
}
export interface Field<T> {
    name: string;
    toText(value: T): string;
    fromText(text: string): T;
    validate(value: T): I18N;
    required: boolean;
}
export declare function createField<T>(name: string, fieldType: FieldType, toText: (value: T) => string, fromText: (text: string) => T, required: boolean, validations?: Validation<T>[]): Field<T>;
export declare function createFieldString(name: string, required: boolean, min?: number, max?: number, validations?: Validation<string>[]): Field<string>;
export declare function createFieldNumber(name: string, decimals: number, required: boolean, min?: number, max?: number, validations?: Validation<number>[]): Field<number>;
