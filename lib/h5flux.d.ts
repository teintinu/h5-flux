import React = require("react");
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
export declare function defineEvent<PAYLOAD>(name: string): Event<PAYLOAD>;
export interface Reference extends Object {
    releaseRef?: () => void;
}
export interface Disposable<T extends Reference> {
    TYPE: T;
    addRef(writable?: boolean): T;
    refCount(): number;
}
export interface DisposableCreatorReturn<T extends Reference> {
    instance: T;
    destructor(): void;
}
export interface DisposableChildren {
    [name: string]: Reference;
}
export declare type DisposableCreator<T extends Reference, CHILDREN extends DisposableChildren> = (children: CHILDREN) => DisposableCreatorReturn<T>;
export declare function defineDisposable<T extends Reference, CHILDREN extends DisposableChildren>(getChildren: () => CHILDREN, creator: DisposableCreator<T, CHILDREN>): Disposable<T>;
export interface ActionDefinition<STATE, PAYLOAD> {
    name: string;
    reduce(state: STATE, payload: PAYLOAD): STATE;
    notify: Event<STATE>[];
}
export interface ActionRef extends Reference {
}
export interface ActionReference<STATE, PAYLOAD> extends ActionRef {
    dispatch(state: STATE, payload: PAYLOAD): void;
}
export interface ActionDefined<STATE, PAYLOAD> extends Disposable<ActionReference<STATE, PAYLOAD>> {
    register: ((payload: PAYLOAD) => void);
}
export declare enum ActionStep {
    reduce = 0,
    notify = 1,
}
export declare function defineAction<STATE, PAYLOAD>(action: ActionDefinition<STATE, PAYLOAD>): ActionDefined<STATE, PAYLOAD>;
export interface StoreRef extends Reference {
}
export interface StoreOfState<STATE> extends StoreRef {
    getState(): STATE;
    changed: {
        on: EventToggle<STATE>;
        off: EventToggle<STATE>;
    };
}
export declare function defineQuery<STATE, T extends Reference, REDUCED>(reduce: (item: STATE, query_string: string) => REDUCED): Disposable<{
    getStore: () => StoreOfState<STATE>;
    getState: () => REDUCED;
    query: (query_string: string) => void;
    changed: {
        on: (l: (payload: REDUCED) => void) => void;
        off: (l: (payload: REDUCED) => void) => void;
    };
} & Reference>;
export declare function defineStore<STATE, T extends Reference, ACTIONS extends Object, QUERIES extends Object>(initialState: STATE, actions: () => ACTIONS, catches: Event<STATE>[], queries?: QUERIES): Disposable<StoreOfState<STATE> & ACTIONS> & {
    query: QUERIES;
};
export declare function declareView<STATE extends Object, PROPS extends Object, PRIVATE_METHODS extends Object, PUBLIC_METHODS extends Object>(getPropDefaults: () => PROPS, getInitialState: () => STATE, public_obj: (view: STATE & PROPS & {
    setState: (view: STATE) => void;
}) => PUBLIC_METHODS, private_obj: (view: STATE & PROPS & PUBLIC_METHODS & {
    setState: (view: STATE) => void;
}) => PRIVATE_METHODS, render: (view: STATE & PROPS & PRIVATE_METHODS & PUBLIC_METHODS) => JSX.Element): React.ClassicComponentClass<PROPS>;
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
export declare function defineField<T>(name: string, labels: FieldLabels, fieldType: FieldType, toText: (value: T) => string, fromText: (text: string) => T, required: boolean, validations?: Validation<T>[]): Field<T>;
export declare function defineFieldString(name: string, labels: FieldLabels, required: boolean, min?: number, max?: number, validations?: Validation<string>[]): Field<string>;
export declare function defineFieldNumber(name: string, labels: FieldLabels, decimals: number, required: boolean, min?: number, max?: number, validations?: Validation<number>[]): Field<number>;
export declare function createFieldBoolean(name: string, labels: FieldLabels, required: boolean, validations?: Validation<boolean>[]): Field<boolean>;
