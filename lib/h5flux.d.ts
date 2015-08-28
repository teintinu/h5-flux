declare module "h5flux"
{
export function leaks(): number;
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
export function asap(fn: () => void): void;
export function immutableSet<T extends Object>(source: T, props: Object): T;
export function defineEvent<PAYLOAD>(name: string): Event<PAYLOAD>;
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
export type DisposableCreator<T extends Reference, CHILDREN extends DisposableChildren> = (children: CHILDREN) => DisposableCreatorReturn<T>;
export function defineDisposable<T extends Reference, CHILDREN extends DisposableChildren>(getChildren: () => CHILDREN, creator: DisposableCreator<T, CHILDREN>): Disposable<T>;
export interface ActionDelegation {
    state: number;
    fn?: (state: any) => void;
}
export function delegateActionTo<STATE, PAYLOAD>(action: ActionDefined<STATE, PAYLOAD>, payload: PAYLOAD): ActionDelegation;
export function delegateActionToMySelf(): {
    state: number;
};
export function delegateActionToNone(): {
    state: number;
};
export interface ActionDefinition<STATE, PAYLOAD> {
    name: string;
    delegate?(state: STATE, payload: PAYLOAD): ActionDelegation;
    reduce?(state: STATE, payload: PAYLOAD): STATE;
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
export enum ActionStep {
    delegate = 0,
    reduce = 1,
    notify = 2,
}
export function defineAction<STATE, PAYLOAD>(action: ActionDefinition<STATE, PAYLOAD>): ActionDefined<STATE, PAYLOAD>;
export interface GenericQuery extends Reference {
}
export interface QueryOfState<STATE> extends GenericQuery {
    getState(): STATE;
    changed: {
        on: EventToggle<STATE>;
        off: EventToggle<STATE>;
    };
}
export interface GenericStore extends Reference {
}
export interface StoreOfState<STATE> extends QueryOfState<STATE>, GenericStore {
}
export function defineQuery<STATE, T extends Reference, REDUCED, QUERY_TYPE>(reduce: (item: STATE, query_string: QUERY_TYPE) => REDUCED): Disposable<{
    getStore: () => StoreOfState<STATE>;
    getState: () => REDUCED;
    query: (query_obj: QUERY_TYPE) => void;
    changed: {
        on: (l: (payload: REDUCED) => void) => void;
        off: (l: (payload: REDUCED) => void) => void;
    };
} & Reference>;
export function defineStore<STATE, T extends Reference, ACTIONS extends Object, QUERIES extends Object, FUNCTIONS extends Object>(definition: {
    initialState: STATE;
    actions: () => ACTIONS;
    catches: Event<STATE>[];
    queries?: QUERIES;
    functions?: FUNCTIONS;
}): Disposable<StoreOfState<STATE> & ACTIONS & {
    functions: FUNCTIONS;
}> & {
    query: QUERIES;
};
export type I18N = string;
export type Validation<T> = (value: T) => I18N;
export enum FieldType {
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
export function defineField<T>(name: string, labels: FieldLabels, fieldType: FieldType, toText: (value: T) => string, fromText: (text: string) => T, required: boolean, validations?: Validation<T>[]): Field<T>;
export function defineFieldString(name: string, labels: FieldLabels, required: boolean, min?: number, max?: number, validations?: Validation<string>[]): Field<string>;
export function defineFieldNumber(name: string, labels: FieldLabels, decimals: number, required: boolean, min?: number, max?: number, validations?: Validation<number>[]): Field<number>;
export function createFieldBoolean(name: string, labels: FieldLabels, required: boolean, validations?: Validation<boolean>[]): Field<boolean>;
}
