import x from 'x';

export const set_using_mouse_cls = fun_name => {
    x[fun_name](document.body, 'using_mouse');
};

export const prevent_el_focus_on_esc = e => {
    const esc_pressed = e.keyCode === 27;

    if (esc_pressed) {
        document.activeElement.blur();
    }
};
