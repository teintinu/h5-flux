var React = require("react");
var _leaks = 0;
function leaks() {
    return _leaks;
}
exports.leaks = leaks;
function asap(fn) {
    if (process)
        process.nextTick(fn);
    else
        setTimeout(fn, 0);
}
exports.asap = asap;
function defineEvent(name) {
    // interface IndexedListenners  {
    //   [key: KEY]: EventListenner<KEY, PAYLOAD>;
    // }
    var on_listenners = [], once_listenners = [];
    var event = {
        name: name,
        emit: emit,
        on: on,
        once: once,
        off: off
    };
    if (eventDefined)
        eventDefined.emit({ name: name, event: event });
    return event;
    function emit(payload) {
        asap(function () {
            if (typeof payload === 'object')
                payload = Object.freeze(payload);
            on_listenners.concat(once_listenners)
                .forEach(function (listenner) {
                return asap(function () { return listenner(payload); });
            });
            once_listenners = [];
        });
    }
    ;
    function on(callback) {
        if (on_listenners.indexOf(callback) == -1)
            on_listenners.push(callback);
    }
    function once(callback) {
        if (once_listenners.indexOf(callback) == -1)
            once_listenners.push(callback);
    }
    function off(callback) {
        var i = on_listenners.indexOf(callback);
        if (i != -1) {
            on_listenners.splice(i, 1);
        }
        i = once_listenners.indexOf(callback);
        if (i != -1) {
            once_listenners.splice(i, 1);
        }
    }
}
exports.defineEvent = defineEvent;
var eventDefined = defineEvent('h5-flux-eventDefined');
function defineDisposable(getChildren, creator) {
    var object;
    var children;
    return { TYPE: undefined, addRef: addRef, refCount: refCount };
    function refCount() {
        return (object && object.__refCount) || 0;
    }
    function addRef(writable) {
        if (!object) {
            _leaks++;
            if (getChildren)
                children = getChildren();
            object = creator(children);
            object.__refCount = 0;
        }
        object.__refCount++;
        return createRef();
        function createRef() {
            var _thisref;
            var props = {};
            Object.keys(object.instance).forEach(function (n) {
                props[n] = {
                    get: function () {
                        return object.instance[n];
                    }
                };
                if (writable)
                    props[n].set = function (value) {
                        object.instance[n] = value;
                    };
            });
            props.releaseRef = {
                value: function () {
                    asap(function () {
                        if (_thisref) {
                            _thisref = null;
                            if (object.__refCount <= 1) {
                                if (children) {
                                    var keys = Object.keys(children);
                                    for (var i = 0; i < keys.length; i++) {
                                        children[keys[i]].releaseRef();
                                    }
                                }
                                var destructor = object.destructor;
                                object = undefined;
                                destructor();
                                _leaks--;
                            }
                            else
                                object.__refCount--;
                        }
                    });
                }
            };
            return _thisref = Object.create(null, props);
        }
    }
}
exports.defineDisposable = defineDisposable;
(function (ActionStep) {
    ActionStep[ActionStep["reduce"] = 0] = "reduce";
    ActionStep[ActionStep["notify"] = 1] = "notify";
})(exports.ActionStep || (exports.ActionStep = {}));
var ActionStep = exports.ActionStep;
;
function defineAction(action) {
    var action_disp = defineDisposable(null, createInstance);
    Object.defineProperty(action_disp, 'register', {
        get: function () {
            return action_disp;
        }
    });
    return action_disp;
    function createInstance() {
        var action_event = defineEvent(action.name);
        action_event.on(catch_action_events);
        return {
            instance: {
                dispatch: emit_reduce
            },
            destructor: function () {
                action_event.off(catch_action_events);
            }
        };
        function emit_reduce(state, payload) {
            var e = { step: ActionStep.reduce, state: state, payload: payload };
            action_event.emit(e);
        }
        function catch_action_events(e) {
            if (e.step === ActionStep.reduce)
                return run_reduce(e.state, e.payload);
            if (e.step === ActionStep.notify)
                return do_notify(e.state);
        }
        function run_reduce(state, payload) {
            var new_state = action.reduce(state, payload);
            do_notify(new_state);
        }
        function do_notify(state) {
            action.notify.forEach(function (n) {
                n.emit(state);
            });
        }
    }
}
exports.defineAction = defineAction;
function defineQuery(reduce) {
    var store;
    var qry = defineDisposable(null, function (c) {
        var _storeref = store.addRef();
        var _state;
        var _query_string;
        var listenners = [];
        var _query = {
            instance: createInstance(),
            destructor: destructor
        };
        reduce_it();
        return _query;
        function createInstance() {
            _storeref.changed.on(changed);
            var inst = {
                getStore: function () { return _storeref; },
                getState: function () { return _state; },
                query: function (query_string) {
                    if (_query_string != query_string) {
                        _query_string = query_string;
                        reduce_it();
                    }
                },
                changed: {
                    on: add_listenner,
                    off: remove_listenner,
                }
            };
            return inst;
        }
        function destructor() {
            _storeref.releaseRef();
        }
        function add_listenner(l) {
            if (listenners.indexOf(l) == -1)
                listenners.push(l);
        }
        function remove_listenner(l) {
            var i = listenners.indexOf(l);
            if (i >= 0)
                listenners.splice(i, 1);
        }
        function changed(newState) {
            reduce_it();
        }
        var reduce_it_ignore;
        function reduce_it() {
            asap(function () {
                if (!reduce_it_ignore) {
                    reduce_it_ignore = true;
                    _state = reduce(_storeref.getState(), _query_string);
                    listenners.forEach(function (l) { return asap(function () { return l(_state); }); });
                    asap(function () {
                        reduce_it_ignore = false;
                    });
                }
            });
        }
    });
    qry.set_store = function (s) { store = s; };
    return qry;
}
exports.defineQuery = defineQuery;
function defineStore(initialState, actions, catches, queries) {
    var store = defineDisposable(null, function (c) {
        var state = initialState;
        var listenners = [];
        var registered_actions = [];
        var instance = createInstance();
        catches.forEach(function (e) { return e.on(changed); });
        return {
            instance: instance,
            destructor: destructor
        };
        function createInstance() {
            var inst = {};
            var actions_created = actions();
            Object.keys(actions_created).forEach(function (key) {
                var ref = actions_created[key].addRef();
                registered_actions.push(ref);
                inst[key] = function (payload) { return ref.dispatch(state, payload); };
            });
            inst.getState = function () { return state; };
            inst.changed = {
                on: add_listenner,
                off: remove_listenner,
            };
            return inst;
        }
        function destructor() {
            catches.forEach(function (e) { return e.off(changed); });
            registered_actions.forEach(function (a) { return a.releaseRef(); });
        }
        function add_listenner(l) {
            if (listenners.indexOf(l) == -1)
                listenners.push(l);
        }
        function remove_listenner(l) {
            var i = listenners.indexOf(l);
            if (i >= 0)
                listenners.splice(i, 1);
        }
        function changed(newState) {
            state = newState;
            listenners.forEach(function (l) { return asap(function () { return l(newState); }); });
        }
    });
    if (queries)
        Object.keys(queries).forEach(function (q) {
            queries[q].set_store(store);
        });
    store.query = queries;
    return store;
}
exports.defineStore = defineStore;
function declareView(getPropDefaults, getInitialState, public_obj, private_obj, render) {
    var component = {
        componentWillMount: function () {
            create_view_instance(this);
        },
        componentWillUnmount: function () {
            release_view_instance(this);
        },
        render: function () {
            return render(getViewState(this));
        }
    };
    var clazz = React.createClass(component);
    return clazz;
    function getViewState(self) {
        var view = self.view;
        self.view_stores.forEach(function (i) { return view[i.name] = i.ref.getState(); });
        return Object.freeze(view);
    }
    function create_view_instance(self) {
        var stores = [];
        var view = [];
        var references = [];
        var keys = Object.keys(this.props);
        if (getInitialState)
            process_obj(getInitialState());
        process_obj(self.props, getPropDefaults);
        if (private_obj)
            process_method(private_obj(view));
        if (public_obj)
            process_method(public_obj(view));
        self.stores = stores;
        self.view = view;
        self.references = references;
        function process_obj(obj, defaults_fn) {
            if (obj) {
                var defaults_vals;
                Object.keys(obj).forEach(function (n) {
                    var m = obj[n];
                    if (m && defaults_vals[n] && defaults_vals[n].releaseRef)
                        defaults_vals[n].releaseRef();
                    if (!m && defaults_fn) {
                        if (!defaults_vals)
                            defaults_vals = defaults_fn();
                        m = defaults_vals[n];
                    }
                    if (m.releaseRef())
                        references.push(m);
                    if (m.getState)
                        stores.push(m);
                    else
                        view[n] = m;
                });
            }
        }
        function process_method(methods) {
            if (methods)
                Object.keys(methods).forEach(function (n) {
                    var m = methods[n];
                    view[n] = function () {
                        m.apply(view, arguments);
                    };
                });
        }
    }
    function release_view_instance(self) {
        self.references.forEach(function (r) {
            if (r && r.releaseRef)
                r.releaseRef();
        });
    }
}
exports.declareView = declareView;
(function (FieldType) {
    FieldType[FieldType["String"] = 0] = "String";
    FieldType[FieldType["Number"] = 1] = "Number";
})(exports.FieldType || (exports.FieldType = {}));
var FieldType = exports.FieldType;
;
function defineField(name, labels, fieldType, toText, fromText, required, validations) {
    return {
        name: name,
        labels: labels,
        toText: toText,
        fromText: fromText,
        required: required,
        validate: validate
    };
    function validate(value) {
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
exports.defineField = defineField;
function defineFieldString(name, labels, required, min, max, validations) {
    validations = validations || [];
    if (min)
        validations.unshift(function (value) {
            if (value && value.length < min)
                return "Preenchimento mínimo de " + min + " caracteres";
        });
    if (max)
        validations.unshift(function (value) {
            if (value && value.length > max)
                return "Preenchimento máximo de " + max + " caracteres";
        });
    return defineField(name, labels, FieldType.String, function (v) { return v; }, function (v) { return v; }, required, validations);
}
exports.defineFieldString = defineFieldString;
function defineFieldNumber(name, labels, decimals, required, min, max, validations) {
    validations = validations || [];
    if (min)
        validations.unshift(function (value) {
            if (value && value < min)
                return "O mínimo é " + toText(min);
        });
    if (max)
        validations.unshift(function (value) {
            if (value && value > max)
                return "O máximo é " + toText(max);
        });
    return defineField(name, labels, FieldType.Number, toText, fromText, required, validations);
    function toText(value) {
        if (!value)
            return;
        return value.toString();
    }
    function fromText(text) {
        if (!text)
            return;
        if (decimals == 0)
            return parseInt(text);
        return parseFloat(text);
    }
}
exports.defineFieldNumber = defineFieldNumber;
function createFieldBoolean(name, labels, required, validations) {
    validations = validations || [];
    return defineField(name, labels, FieldType.Number, toText, fromText, required, validations);
    function toText(value) {
        if (value === true)
            return 'Sim';
        if (value === false)
            return 'Não';
        return "";
    }
    function fromText(text) {
        return text && /s(im)?/i.test(text);
    }
}
exports.createFieldBoolean = createFieldBoolean;
//# sourceMappingURL=h5flux.js.map