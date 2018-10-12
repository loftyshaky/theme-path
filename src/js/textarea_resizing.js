'use strict';

import x from 'x';

import { observable, action, configure } from "mobx";

configure({ enforceActions: 'observed' });

//> varibles t
export const ob = observable({
    textareas_si: []
});
//< varibles t