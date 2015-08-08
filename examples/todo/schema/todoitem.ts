import {
createFieldString,
createFieldBoolean}
from "../../../lib/h5-flux.d";

export default {
    title: createFieldString("title", { caption: "Título", hint: "Título da tarefa" }, true),
    done: createFieldBoolean("done", { caption: "Feito", hint: "Tarefa feita" }, true)
};
