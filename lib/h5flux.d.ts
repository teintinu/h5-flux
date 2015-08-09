export declare function leaks(): number;
export declare type EventEmmiter<PAYLOAD> = (payload: PAYLOAD) => void;
export declare type EventListener<PAYLOAD> = (payload: PAYLOAD) => void;
export declare type EventToggle<PAYLOAD> = (callback: EventListener<PAYLOAD>) => void;
export interface Event<PAYLOAD> {
    name: string;
    emit: EventEmmiter<PAYLOAD>;
    on: EventToggle<PAYLOAD>;
    once: EventToggle<PAYLOAD>;
    off: EventToggle<PAYLOAD>;
}
export declare function asap(fn: () => void): void;
export declare function createEvent<PAYLOAD>(name: string): Event<PAYLOAD>;
export interface Reference extends Object {
    releaseRef?: () => void;
}
export interface Disposable<T extends Reference> {
    addRef(): T;
    refCount(): number;
}
export declare type DisposableCreatorReturn<T extends Reference> = {
    instance: T;
    destructor: () => void;
};
export interface DisposableChildren {
    [name: string]: Reference;
}
export declare type DisposableCreator<T extends Reference, CHILDREN extends DisposableChildren> = (children: CHILDREN) => DisposableCreatorReturn<T>;
export declare function createDisposable<T extends Reference, CHILDREN extends DisposableChildren>(children: CHILDREN, creator: DisposableCreator<T, CHILDREN>): Disposable<T>;
export interface ActionDefinition<STATE, PAYLOAD> {
    name: string;
    reduce(state: STATE, payload: PAYLOAD): STATE;
    notify: Event<STATE>[];
}
export interface ActionReference<STATE, PAYLOAD> extends Reference {
    dispatch(state: STATE, payload: PAYLOAD): void;
}
export interface ActionInstance<STATE, PAYLOAD> extends Disposable<ActionReference<STATE, PAYLOAD>> {
}
export declare enum ActionStep {
    reduce = 0,
    notify = 1,
}
export declare function createAction<STATE, PAYLOAD>(action: ActionDefinition<STATE, PAYLOAD>): ActionInstance<STATE, PAYLOAD>;
export interface Store<STATE> extends Reference {
    getState(): STATE;
    changed: {
        on: EventToggle<STATE>;
        off: EventToggle<STATE>;
    };
}
export declare function createStore<STATE, T extends Reference, ACTIONS extends DisposableChildren>(initialState: STATE, actions: ACTIONS, catches: Event<STATE>[], createInstance: (state: STATE, action: ACTIONS) => T): Disposable<Store<STATE> & T>;
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
