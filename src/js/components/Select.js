'use strict';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import { selects_options } from 'js/selects_options';
import * as shared from 'js/shared';
import * as change_val from 'js/change_val';
import * as set_default_or_disabled from 'js/set_default_or_disabled';

import { Help } from 'components/Help';

import React from 'react';
import * as r from 'ramda';
import { observer } from 'mobx-react';

//--

export class Select extends React.Component {
    constructor(props) {
        super(props);

        this.input = React.createRef();
        this.select_w = React.createRef();
        this.select = React.createRef();
    }

    componentDidUpdate() {
        if (this.props.name == 'default_locale') {
            this.props.count_char();
        }
    }

    //> create one option element
    create_option = option => {
        return <li key={option.key} className='option' data-val={option.val} onClick={this.change_select_val}>{option.text}</li>
    }
    //< create one option element

    //> change option val when selecting option
    change_select_val = e => {
        const val = e.target.dataset.val

        change_val.change_val(this.props.family, this.props.i, val, null);

        this.hide_options();

        if (val == 'default') {
            set_default_or_disabled.set_default_or_disabled(this.props.family, this.props.i, 'select');
        }
    }
    //< change option val when selecting option

    //> hide options when clicking on option or select_title
    hide_options = async () => {
        if (document.activeElement == this.select_w.current) {
            await x.delay(0);

            this.select_w.current.blur();
        }
    }
    //< hide options when clicking on option or select_title

    //> hide options when clicking on option or select_title / scroll select options into view when oipening select
    on_mouse_down = async () => {
        if (document.activeElement == this.select_w.current) {
            await x.delay(0);

            this.select_w.current.blur();

        } else if (this.props.family != 'settings') {
            await x.delay(0);

            const fieldset_w = x.closest(this.input.current, '.fieldset_w');
            const fieldset = x.closest(this.input.current, 'fieldset');
            const fieldset_style = window.getComputedStyle(fieldset);
            const fieldset_div = x.closest(this.input.current, 'fieldset > div');
            const fieldset_div_visible_height = fieldset_div.clientHeight;
            const margin_top_of_fieldset_plus_its_border = parseInt(window.getComputedStyle(fieldset_w).marginTop) + parseInt(window.getComputedStyle(fieldset).borderWidth);
            const select_w_margin_bottom = parseInt(window.getComputedStyle(this.select_w.current).marginBottom);
            let select_w_rect_bottom = this.select_w.current.getBoundingClientRect().bottom;
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
    }
    //< hide options when clicking on option or select_title / scroll select options into view when oipening select

    render() {
        const options = selects_options[this.props.name != 'default_locale' ? this.props.name : 'locale'];
        const val = inputs_data.obj[this.props.family][this.props.i].val;
        const selected_option = shared.find_from_val(options, val);

        const selected_option_text = r.ifElse(
            () => selected_option,

            () => selected_option.text,
            () => {
                if (options[0].val == 'default') {
                    return shared.find_from_val(options, options[0].val).text;
                }
            }
        )();

        return (
            <div
                className='input select_input'
                ref={this.input}
            >
                <div>
                    <label
                        className='input_label'
                        data-text={this.props.name + '_label_text'}
                    ></label>
                    <div
                        className='select_w settings_input'
                        tabIndex='0'
                        ref={this.select_w}
                    >
                        <div
                            className='select_title'
                            onMouseDown={this.on_mouse_down}
                        >
                            {selected_option_text}
                        </div>
                        <ul
                            className='select'
                            ref={this.select}
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

Select = observer(Select);