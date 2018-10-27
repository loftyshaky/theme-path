//> console.log t

//> selecting elements t

//> notify about error f

//> dom manipulation t

//> matches f

//> closest f

//> move an array item t

//> load_css f

//> delay f

//>1 unique_id f

//> filter_classes f

//^

'use strict';

import * as r from 'ramda';

const loc = require('locales/en.json');

const x = {};

//> console.log t
window.l = console.log.bind(console);
//< console.log t

//> selecting elements t
window.s = (selector) => { // $
    return document.querySelector(selector);
}

window.sa = (selector) => { // $ All
    return document.querySelectorAll(selector);
}

window.sb = (base_element, selector) => { // $ with base element
    return base_element ? base_element.querySelector(selector) : null;
}

window.sab = (base_element, selector) => { // $ All with base element
    return base_element ? base_element.querySelectorAll(selector) : null;
}
//< selecting elements t

//> notify about error f
x.error = (error_code, extra) => {
    const error_message = x.message('error_alert') + error_code + (extra ? '\n' + x.message(extra) : '');

    alert(error_message);
}
//< notify about error f

//> dom manipulation t
x.create = (el_type, class_name) => { // create element
    let el = document.createElement(el_type);
    el.className = class_name;

    return el;
};

x.append = (el, child) => { // append child
    if (el && el.nodeType == 1) { // if not document
        el.appendChild(child);
    }
};

x.remove = el => { // remove child
    if (el && el.nodeType == 1) { // if not document
        el.parentNode.removeChild(el);
    }
};


x.before = (el_to_insert_before, el_to_insert) => { // insert before
    if (el_to_insert_before && el_to_insert.nodeType == 1) { // if not document
        el_to_insert_before.parentNode.insertBefore(el_to_insert, el_to_insert_before);
    }
};

x.after = (el_to_insert_after, el_to_insert) => { // insert after
    if (el_to_insert_after && el_to_insert.nodeType == 1) { // if not document
        el_to_insert_after.parentNode.insertBefore(el_to_insert, el_to_insert_after.nextElementSibling);
    }
};
//< dom manipulation t

//> matches f
x.matches = (el, selector) => {
    if (el && el.nodeType == 1) { // if not document
        return el.matches(selector);

    } else {
        return false;
    }
};
//< matches f

//> closest f
x.closest = (el, selector) => {
    if (el && el.nodeType == 1) { // if not document
        return el.closest(selector);
    }
};
//< closest f

//> move an array item t
x.move_a_item = (a, from, to) => {
    a.splice(to, 0, a.splice(from, 1)[0]);
};
//< move an array item t

//> load_css f
x.load_css = (filename) => {
    let link;
    
    if (!sb(document.head, '.' + filename)) {
        link = document.createElement('link');
        link.className = filename;
        link.href = filename + '.css';
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        x.append(document.head, link);
    }

    return link;
};
//< load_css f

//> debounce f
x.debounce = (f, wait, immediate, e) => {
    let timeout;

    return function () {
        var context = this, args = arguments;

        var later = () => {
            timeout = null;

            if (!immediate) {
                f.apply(context, args)
            };
        };

        let call_now = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (call_now) {
            f.apply(context, args)
        };
    };
};
//< debounce f

//> delay f
x.delay = delay => {
    return new Promise(resolve => window.setTimeout(() => resolve(), delay));
};
//< delay f

//>1 unique_id f
x.unique_id = () => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const len = possible.length;
    let unique_id = Date.now();

    for (let i = 0; i < 8; i++) {
        unique_id += possible.charAt(Math.floor(Math.random() * len));
    }

    return unique_id;
};
//<1 unique_id f

//> filter_classes f
x.cls = classes => {
    const pipe_f = r.pipe(r.filter, r.values, r.join(' '));

    return pipe_f(item => item, classes);
}
//< filter_classes f

//>1 localization t
x.message = (message) => {
    return loc[message];
}

x.localize = (base_element) => {
    const localize_inner = (item_key, loc_key, what_browser) => {
        const arr = sab(base_element, '[data-' + loc_key + ']');

        arr.forEach(item => item[item_key] = x.message(item.dataset[loc_key]));
    }

    const localize_inner_cur = r.curry(localize_inner)(r.__, r.__, '');

    localize_inner_cur('innerHTML', 'text');
    localize_inner_cur('placeholder', 'placeholder');
    localize_inner_cur('href', 'href');
    localize_inner_cur('title', 'title');
}
//<1 localization t

x.map_i = r.addIndex(r.map);

export default x;