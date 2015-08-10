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
function createEvent(name) {
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
    if (eventCreated)
        eventCreated.emit({ name: name, event: event });
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
exports.createEvent = createEvent;
var eventCreated = createEvent('h5-flux-eventCreated');
function createDisposable(getChildren, creator) {
    var object;
    var children;
    return { addRef: addRef, refCount: refCount };
    function refCount() {
        return (object && object.__refCount) || 0;
    }
    function addRef() {
        if (!object) {
            _leaks++;
            if (getChildren)
                children = getChildren();
            object = creator(children);
            object.__refCount = 0;
            object.instance.releaseRef = releaseRef;
        }
        object.__refCount++;
        function releaseRef() {
            asap(function () {
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
            });
        }
        return object.instance;
    }
}
exports.createDisposable = createDisposable;
(function (ActionStep) {
    ActionStep[ActionStep["reduce"] = 0] = "reduce";
    ActionStep[ActionStep["notify"] = 1] = "notify";
})(exports.ActionStep || (exports.ActionStep = {}));
var ActionStep = exports.ActionStep;
;
function createAction(action) {
    return createDisposable(null, createInstance);
    function createInstance() {
        var action_event = createEvent(action.name);
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
exports.createAction = createAction;
function createStore(initialState, actions, catches, createInstance) {
    return createDisposable(actions, function (actions) {
        var state = initialState;
        var listenners = [];
        var instance = createInstance(state, actions);
        instance.getState = function () { return state; };
        instance.changed = {
            on: add_listenner,
            off: remove_listenner,
        };
        catches.forEach(function (e) { return e.on(changed); });
        return {
            instance: instance,
            destructor: function () {
                catches.forEach(function (e) { return e.off(changed); });
            }
        };
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
}
exports.createStore = createStore;
(function (FieldType) {
    FieldType[FieldType["String"] = 0] = "String";
    FieldType[FieldType["Number"] = 1] = "Number";
})(exports.FieldType || (exports.FieldType = {}));
var FieldType = exports.FieldType;
;
function createField(name, labels, fieldType, toText, fromText, required, validations) {
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
exports.createField = createField;
function createFieldString(name, labels, required, min, max, validations) {
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
    return createField(name, labels, FieldType.String, function (v) { return v; }, function (v) { return v; }, required, validations);
}
exports.createFieldString = createFieldString;
function createFieldNumber(name, labels, decimals, required, min, max, validations) {
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
    return createField(name, labels, FieldType.Number, toText, fromText, required, validations);
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
exports.createFieldNumber = createFieldNumber;
function createFieldBoolean(name, labels, required, validations) {
    validations = validations || [];
    return createField(name, labels, FieldType.Number, toText, fromText, required, validations);
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