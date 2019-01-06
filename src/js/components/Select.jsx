import React from 'react';
import * as r from 'ramda';
import { observer } from 'mobx-react';
import ReactSelect from 'react-select';
import * as analytics from 'js/analytics';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import { selects_options } from 'js/selects_options';
import * as shared from 'js/shared';
import * as change_val from 'js/change_val';
import * as set_default_or_disabled from 'js/set_default_or_disabled';
import * as wf_shared from 'js/work_folder/wf_shared';

import { Help } from 'components/Help';

//--

export class Select extends React.Component {
    constructor(props) {
        super(props);

        ({
            name: this.name,
            family: this.family,
            i: this.i,
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

            change_val.change_val(this.family, this.i, value, null);

            if (value === 'default') {
                set_default_or_disabled.set_default_or_disabled(this.family, this.i, 'select');
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
        const { val } = inputs_data.obj[this.family][this.i];
        const options = selects_options[this.name !== 'default_locale' ? this.name : 'locale'];
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
                        data-text={`${this.name}_label_text`}
                    />
                    <ReactSelect
                        value={selected_option_final}
                        options={options}
                        isDisabled={wf_shared.com2.inputs_disabled_2 && this.family !== 'options'}
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
