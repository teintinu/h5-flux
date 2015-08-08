export declare function getCurrentStoreCount(): {
    activeEvents: number;
    activeStores: number;
};
export declare type EventEmmiter<PAYLOAD> = (payload: PAYLOAD) => void;
export declare type EventListenner<PAYLOAD> = (payload: PAYLOAD) => void;
export declare type EventToggle<PAYLOAD> = (callback: EventListenner<PAYLOAD>) => void;
export interface Event<PAYLOAD> {
    name: string;
    emit: EventEmmiter<PAYLOAD>;
    on: EventToggle<PAYLOAD>;
    off: EventToggle<PAYLOAD>;
}
export declare function asap(fn: () => void): void;
export declare function createEvent<PAYLOAD>(name: string): Event<PAYLOAD>;
export interface Action<STATE, PAYLOAD> {
    name: string;
    reduce(state: STATE, payload: PAYLOAD): STATE;
    notify: Event<STATE>[];
}
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
