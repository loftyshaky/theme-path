'use_strict';

import { inputs_data } from 'js/inputs_data';

import { action, configure } from "mobx";

configure({ enforceActions: 'observed' });

export const change_val = action((family, i, e) => {
    inputs_data.obj[family][i].value = e.target.value;
});

export const change_select_val = action((family, i, storage, val, e) => {
    inputs_data.obj[family][i].value = val;
});