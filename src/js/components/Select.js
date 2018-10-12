'use strict';

import x from 'x';

import { selects_options } from 'js/selects_options';

import { Help } from 'components/Help';

import react from 'react';
import * as r from 'ramda';

//> Select c
export class Select extends react.Component {
    constructor(props) {
        super(props);

        this.input = react.createRef();
        this.select_w = react.createRef();
        this.select = react.createRef();
    }

    //>1 create one option element t
    create_option = option => {
        return <li key={option.key} className='option' data-storage={option.storage} data-val={option.val} onClick={this.change_select_val}>{option.text}</li>
    }
    //<1 create one option element t

    //>1 change option value when selecting option t
    change_select_val = e => {
        settings.change_select_val(e.target.dataset.storage, e.target.dataset.val, e.target.textContent);

        this.hide_options();
    }
    //<1 change option value when selecting option t

    //>1 hide options when clicking on option or select_title / scroll select options into view when oipening select
    on_click = async () => {
        if (document.activeElement == this.select_w.current) {
            await x.delay(0);

            this.select_w.current.blur();

        } else {
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
    //<1 hide options when clicking on option or select_title / scroll select options into view when oipening select

    render() {
        const options = selects_options[this.props.name != 'default_locale' ? this.props.name : 'locale'];

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
                            onMouseDown={this.on_click}
                        ></div>
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
//< Select c