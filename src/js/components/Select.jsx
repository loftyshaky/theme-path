import React from 'react';
import * as r from 'ramda';
import { observer } from 'mobx-react';
import ReactSelect from 'react-select';

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

    //> change option val when selecting option
    change_select_val = selected_option => {
        try {
            const { family, i } = this.props;
            const { value } = selected_option;

            change_val.change_val(family, i, value, null);

            if (value === 'default') {
                set_default_or_disabled.set_default_or_disabled(family, i, 'select');
            }

        } catch (er) {
            err(er, 107);
        }
    }
    //< change option val when selecting option

    on_menu_open = async () => {
        await x.delay(0);

        this.transit_menu();
        this.scroll_select_menu_into_view();
    }

    //> hide options when clicking on option or select_title / scroll select options into view when oipening select
    scroll_select_menu_into_view = () => {
        try {
            const { family } = this.props;

            if (family !== 'settings') {
                const select_menu = s('.select__menu');

                const fieldset_w = x.closest(this.input, '.fieldset_w');
                const fieldset = x.closest(this.input, 'fieldset');
                const fieldset_div = x.closest(this.input, 'fieldset > div');
                const fieldset_div_visible_height = fieldset_div.clientHeight;
                const fieldset_margin_top = parseInt(window.getComputedStyle(fieldset_w).marginTop);
                const fieldset_border_width = parseInt(window.getComputedStyle(fieldset).borderWidth);
                const margin_top_of_fieldset_plus_its_border = fieldset_margin_top + fieldset_border_width;
                const select_w_margin_bottom = parseInt(window.getComputedStyle(select_menu).marginBottom);
                let select_w_rect_bottom = select_menu.getBoundingClientRect().bottom;
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
    //< hide options when click

    transit_menu = () => {
        x.add_cls(s('.select__menu'), 'select__menu_is_focused');
    }

    render() {
        const { name, family, i } = this.props;
        const { val } = inputs_data.obj[family][i];
        const options = selects_options[name !== 'default_locale' ? name : 'locale'];
        const selected_option = shared.find_from_val(options, val);

        const selected_option_final = r.ifElse(
            () => selected_option,

            () => selected_option,
            () => {
                if (options[0].value === 'default') {
                    return options[0];
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
                    <ReactSelect
                        value={selected_option_final}
                        options={options}
                        classNamePrefix="select"
                        backspaceRemovesValue={false}
                        onChange={this.change_select_val}
                        onMenuOpen={this.on_menu_open}
                    />
                    <Help {...this.props} />
                </div>
            </div>
        );
    }
}

observer(Select);
