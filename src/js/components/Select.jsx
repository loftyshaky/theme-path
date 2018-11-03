import React from 'react';
import * as r from 'ramda';
import { observer } from 'mobx-react';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import { selects_options } from 'js/selects_options';
import * as shared from 'js/shared';
import * as change_val from 'js/change_val';
import * as set_default_or_disabled from 'js/set_default_or_disabled';

import { Help } from 'components/Help';

//--

export class Select extends React.Component {
    componentDidUpdate() {
        try {
            const { name, count_char } = this.props;

            if (name === 'default_locale') {
                count_char();
            }


        } catch (er) {
            err(er, 106);
        }
    }

    //> create one option element
    create_option = option => (
        /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/role-has-required-aria-props */
        <li
            key={option.key}
            className="option"
            role="option"
            data-val={option.val}
            onClick={this.change_select_val}
        >
            {option.text}
        </li>
    );
    //< create one option element

    //> change option val when selecting option
    change_select_val = e => {
        try {
            const { family, i } = this.props;
            const { val } = e.target.dataset;

            change_val.change_val(family, i, val, null);

            this.hide_options();

            if (val === 'default') {
                set_default_or_disabled.set_default_or_disabled(family, i, 'select');
            }

        } catch (er) {
            err(er, 107);
        }
    }
    //< change option val when selecting option

    //> hide options when clicking on option or select_title
    hide_options = async () => {
        try {
            if (document.activeElement === this.select_w) {
                await x.delay(0);

                this.select_w.blur();
            }

        } catch (er) {
            err(er, 108);
        }
    }
    //< hide options when clicking on option or select_title

    //> hide options when clicking on option or select_title / scroll select options into view when oipening select
    on_mouse_down = async () => {
        try {
            const { family } = this.props;

            if (document.activeElement === this.select_w) {
                await x.delay(0);

                this.select_w.blur();

            } else if (family !== 'settings') {
                await x.delay(0);

                const fieldset_w = x.closest(this.input, '.fieldset_w');
                const fieldset = x.closest(this.input, 'fieldset');
                const fieldset_div = x.closest(this.input, 'fieldset > div');
                const fieldset_div_visible_height = fieldset_div.clientHeight;
                const fieldset_margin_top = parseInt(window.getComputedStyle(fieldset_w).marginTop);
                const fieldset_border_width = parseInt(window.getComputedStyle(fieldset).borderWidth);
                const margin_top_of_fieldset_plus_its_border = fieldset_margin_top + fieldset_border_width;
                const select_w_margin_bottom = parseInt(window.getComputedStyle(this.select_w).marginBottom);
                let select_w_rect_bottom = this.select_w.getBoundingClientRect().bottom;
                let while_loop_runned_at_least_once = false;
                let scroll_top_modifier = 0;

                while (select_w_rect_bottom - margin_top_of_fieldset_plus_its_border > fieldset_div_visible_height) {
                    while_loop_runned_at_least_once = true;
                    scroll_top_modifier++;
                    select_w_rect_bottom--;
                }

                if (while_loop_runned_at_least_once) {
                    fieldset_div.scrollTop = fieldset_div.scrollTop + scroll_top_modifier + select_w_margin_bottom;
                }
            }

        } catch (er) {
            err(er, 109);
        }
    }
    //< hide options when clicking on option or select_title / scroll select options into view when oipening select

    render() {
        const { name, family, i } = this.props;
        const { val } = inputs_data.obj[family][i];
        const options = selects_options[name !== 'default_locale' ? name : 'locale'];
        const selected_option = shared.find_from_val(options, val);

        const selected_option_text = r.ifElse(
            () => selected_option,

            () => selected_option.text,
            () => {
                if (options[0].val === 'default') {
                    return shared.find_from_val(options, options[0].val).text;
                }
                return false;
            },
        )();

        return (
            <div
                className="input select_input"
                ref={input => { this.input = input; }}
            >
                <div>
                    <label
                        className="input_label"
                        data-text={`${name}_label_text`}
                    />
                    <div
                        className="select_w settings_input"
                        role="button"
                        tabIndex="0"
                        ref={select_w => { this.select_w = select_w; }}
                    >
                        <div
                            className="select_title"
                            role="presentation"
                            onMouseDown={this.on_mouse_down}
                        >
                            {selected_option_text}
                        </div>
                        <ul
                            className="select"
                            ref={select => { this.select = select; }}
                        >
                            {options.map(this.create_option)}
                        </ul>
                    </div>
                    <Help {...this.props} />
                </div>
            </div>
        );
    }
}

observer(Select);
