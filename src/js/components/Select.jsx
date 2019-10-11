import React from 'react';
import * as r from 'ramda';
import { observer } from 'mobx-react';
import ReactSelect from 'react-select';
import Store from 'electron-store';
import * as analytics from 'js/analytics';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import { selects_options } from 'js/selects_options';
import * as change_val from 'js/change_val';
import * as set_default_or_disabled from 'js/set_default_or_disabled';
import * as els_state from 'js/els_state';
import * as history from 'js/history';
import * as conds from 'js/conds';

import { Help_btn } from 'components/Help_btn';

const store = new Store();

export class Select extends React.Component {
    constructor(props) {
        super(props);

        ({
            name: this.name,
            family: this.family,
        } = this.props);
    }

    componentDidUpdate() {
        try {
            const { count_char } = this.props;

            if (this.name === 'default_locale') {
                count_char();
            }

        } catch (er) {
            err(er, 106);
        }
    }

    //> change option val when selecting option
    change_select_val = selected_option => {
        try {
            const { value } = selected_option;
            const previous_val = inputs_data.obj[this.family][this.name].val;
            const was_default = previous_val === 'default';
            let set_to_default;

            if (value === 'default') {
                set_to_default = true;

                set_default_or_disabled.set_default_or_disabled(this.family, this.name, 'select');

            } else {
                change_val.change_val(this.family, this.name, value, null, true);

                set_to_default = false;
            }

            if (conds.selects(this.family, this.name)) {
                history.record_change(() => history.generate_select_history_obj(this.family, this.name, was_default, previous_val, value, set_to_default));
            }

            analytics.send_event('selects', `selected_option-${this.family}-${this.name}-${value}`);

        } catch (er) {
            err(er, 107);
        }
    }
    //< change option val when selecting option

    on_menu_open = async () => {
        await x.delay(0);

        this.transit_menu();
        this.scroll_select_menu_into_view();

        analytics.send_event('selects', `expanded-${this.family}-${this.name}`);
    }

    //> hide options when clicking on option or select_title / scroll select options into view when oipening select
    scroll_select_menu_into_view = () => {
        try {
            const { family } = this.props;

            if (family !== 'options') {
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
        const { val } = inputs_data.obj[this.family][this.name];
        const locales_whitelist = store.get('locales_whitelist');
        const options = selects_options[this.name !== 'default_locale' ? this.name : 'locale'];
        const selected_option = options.find(item => item.value === val);
        const options_final = this.name === 'locale' || this.name === 'default_locale'
            ? options.filter(option => locales_whitelist === '' || locales_whitelist.indexOf(option.value) > -1)
            : options;

        const selected_option_final = r.ifElse(
            () => selected_option,

            () => selected_option,
            () => {
                if (options_final[0].value === 'default') {
                    return options_final[0];
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
                        data-text={`${this.name}_label_text`}
                    />
                    <ReactSelect
                        value={selected_option_final}
                        options={options_final}
                        isDisabled={els_state.com2.inputs_disabled_2 && this.family !== 'options'}
                        classNamePrefix="select"
                        backspaceRemovesValue={false}
                        onChange={this.change_select_val}
                        onMenuOpen={this.on_menu_open}
                    />
                    <Help_btn {...this.props} />
                </div>
            </div>
        );
    }
}

observer(Select);
