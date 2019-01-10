import * as r from 'ramda';

import { join } from 'path';
import { remote } from 'electron';

import package_json from 'package_json'; // eslint-disable-line import/no-unresolved

//--

const os_lang = remote.getGlobal('os_lang');
const loc = require(`locales/${os_lang}.json`); // eslint-disable-line import/no-dynamic-require

const x = {};

//> console.log
window.l = console.log.bind(console); // eslint-disable-line no-console
//< console.log

window.app_version = package_json.version;
window.app_root = remote.getGlobal('dev') ? process.cwd() : join(remote.app.getAppPath(), '../../');

//> selecting elements
window.s = selector => document.querySelector(selector); // $

window.sa = selector => document.querySelectorAll(selector); // $ All

window.sb = (base_element, selector) => ( // $ with base element
    base_element ? base_element.querySelector(selector) : null
);

window.sab = (base_element, selector) => ( // $ All with base element
    base_element ? base_element.querySelectorAll(selector) : null
);
//< selecting elements

//> dom manipulation
x.create = (el_type, class_name) => { // create element
    const el = document.createElement(el_type);
    el.className = class_name;

    return el;
};

x.append = (el, child) => { // append child
    if (el && el.nodeType === 1) { // if not document
        el.appendChild(child);
    }
};

x.remove = el => { // remove child
    if (el && el.nodeType === 1) { // if not document
        el.parentNode.removeChild(el);
    }
};


x.before = (el_to_insert_before, el_to_insert) => { // insert before
    if (el_to_insert_before && el_to_insert.nodeType === 1) { // if not document
        el_to_insert_before.parentNode.insertBefore(el_to_insert, el_to_insert_before);
    }
};

x.after = (el_to_insert_after, el_to_insert) => { // insert after
    if (el_to_insert_after && el_to_insert.nodeType === 1) { // if not document
        el_to_insert_after.parentNode.insertBefore(el_to_insert, el_to_insert_after.nextElementSibling);
    }
};

x.as_first = (el_to_insert_first, el_to_insert) => { // insert as the first child
    if (el_to_insert_first && el_to_insert.nodeType === 1) { // if not document
        el_to_insert_first.insertBefore(el_to_insert, el_to_insert_first.firstElementChild);
    }
};
//< dom manipulation

x.matches = (el, selector) => {
    if (el && el.nodeType === 1) { // if not document
        return el.matches(selector);

    }

    return false;
};

x.closest = (el, selector) => {
    if (el && el.nodeType === 1) { // if not document
        return el.closest(selector);
    }

    return false;
};

x.move = (from, to, arr) => r.insert(to, r.nth(from, arr), r.remove(from, 1, arr));

x.remove_cls = (el, cls_name) => {
    if (el && el.nodeType === 1) { // if not document
        el.classList.remove(cls_name);
    }
};

x.add_cls = (el, cls_name) => {
    if (el && el.nodeType === 1) { // if not document
        el.classList.add(cls_name);
    }
};

//> move an array item
x.move_a_item = (a, from, to) => {
    a.splice(to, 0, a.splice(from, 1)[0]);
};
//< move an array item

x.load_css = filename => {
    let link;

    if (!sb(document.head, `.${filename}`)) {
        link = document.createElement('link');
        link.className = filename;
        link.href = `${filename}.css`;
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        x.append(document.head, link);
    }

    return link;
};

x.debounce = (f, wait, immediate) => {
    let timeout;

    return function () { // eslint-disable-line func-names
        const context = this;
        const args = arguments; // eslint-disable-line prefer-rest-params

        const later = () => {
            timeout = null;

            if (!immediate) {
                f.apply(context, args);
            }
        };

        const call_now = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (call_now) {
            f.apply(context, args);
        }
    };
};

x.delay = delay => new Promise(resolve => window.setTimeout(() => resolve(), delay));

x.unique_id = () => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const len = possible.length;
    let unique_id = Date.now();

    for (let i = 0; i < 8; i++) {
        unique_id += possible.charAt(Math.floor(Math.random() * len));
    }

    return unique_id;
};

x.cls = classes => {
    const pipe_f = r.pipe(r.filter, r.values, r.join(' '));

    return pipe_f(item => item, classes);
};

//> localization
x.msg = msg => loc[msg];

x.localize = base_element => {
    const localize_inner = (item_key, loc_key) => {
        const arr = sab(base_element, `[data-${loc_key}]`);

        arr.forEach(item => {
            const new_item = item;
            new_item[item_key] = x.msg(item.dataset[loc_key]);
        });
    };

    const localize_inner_cur = r.curry(localize_inner)(r.__, r.__, '');

    localize_inner_cur('innerHTML', 'text');
    localize_inner_cur('placeholder', 'placeholder');
    localize_inner_cur('href', 'href');
    localize_inner_cur('title', 'title');
};
//< localization

//> ramda
x.map_i = r.addIndex(r.map);
//< ramda

export default x;
