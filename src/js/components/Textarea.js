'use strict';

import x from 'x';

import * as shared from 'js/shared';
import * as change_val from 'js/change_val';
import { inputs_data } from 'js/inputs_data';

import { Help } from 'components/Help';

import react from 'react';
import { observer } from "mobx-react";
import { observable, action, configure } from "mobx";

configure({ enforceActions: 'observed' });

export class Textarea extends react.Component {
    constructor(props) {
        super(props);

        this.textarea = react.createRef();

        this.ob = observable({
            number_of_chars: 0,
            char_limit_exceeded: false
        });
    }

    componentDidMount() {
        this.resize_textarea();
    }

    async componentDidUpdate() {
        this.resize_textarea();
        this.count_char();

        await x.delay(0);

        this.resize_textarea();
    }

    resize_textarea = async () => {
        this.textarea.current.style.height = '';

        const scrool_height = this.textarea.current.scrollHeight;

        this.textarea.current.style.height = scrool_height + 2 + 'px';

        if (scrool_height > 204) {
            this.textarea.current.style.overflow = 'visible';

        } else {
            this.textarea.current.style.overflow = ''; // in css hidden
        }
    }

    count_char = action(() => {
        if (this.props.counter) {
            const number_of_chars = this.textarea.current.value.length;
            const locale = shared.find_from_name(inputs_data.obj[this.props.family], 'locale').val;
            const default_locale = shared.find_from_name(inputs_data.obj[this.props.family], 'default_locale').val;

            this.ob.number_of_chars = this.textarea.current.value.length;

            if (number_of_chars > this.props.char_limit && locale == default_locale) {
                this.ob.char_limit_exceeded = true;

            } else {
                this.ob.char_limit_exceeded = false;
            }
        }
    })

    render() {
        const val = inputs_data.obj[this.props.family][this.props.i].val;
        const counter = this.props.counter ? <span className={x.cls(['counter', this.ob.char_limit_exceeded ? 'char_limit_exceeded_counter' : ''])}>{this.ob.number_of_chars}</span> : null;

        return (
            <div className='input'>
                <label
                    className='input_label'
                    data-text={this.props.name + '_label_text'}
                    htmlFor={this.props.name + '_input'}
                ></label>
                <textarea
                    id={this.props.name + '_input'}
                    className={this.ob.char_limit_exceeded ? 'char_limit_exceeded_textarea' : ''}
                    ref={this.textarea}
                    value={val}
                    onInput={change_val.change_val.bind(null, this.props.family, this.props.i, 'is_not_select', null)}
                    onChange={() => null}
                ></textarea>
                <Help {...this.props} />
                {counter}
            </div>
        );
    }
}

Textarea = observer(Textarea);