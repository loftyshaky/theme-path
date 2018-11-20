import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, configure } from 'mobx';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import * as shared from 'js/shared';
import * as change_val from 'js/change_val';
import * as wf_shared from 'js/work_folder/wf_shared';

import { Help } from 'components/Help';

configure({ enforceActions: 'observed' });

//--

export class Textarea extends React.Component {
    constructor(props) {
        super(props);

        this.textarea = React.createRef();

        this.ob = observable({
            number_of_chars: 0,
            char_limit_exceeded: false,
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

    set_char_limit_exceeded_bool = action(bool => {
        try {
            this.ob.char_limit_exceeded = bool;

        } catch (er) {
            err(er, 110);
        }
    })

    set_number_of_chars_val = action(val => {
        try {
            this.ob.number_of_chars = val;

        } catch (er) {
            err(er, 111);
        }
    })

    resize_textarea = async () => {
        try {
            this.textarea.style.height = '';

            const scrool_height = this.textarea.scrollHeight;

            this.textarea.style.height = `${scrool_height + 2}px`;

            if (scrool_height > 204) {
                this.textarea.style.overflow = 'visible';

            } else {
                this.textarea.style.overflow = ''; // in css hidden
            }

        } catch (er) {
            err(er, 112);
        }
    }

    count_char = () => {
        try {
            const { family, counter, char_limit } = this.props;

            if (counter) {
                const number_of_chars = this.textarea.value.length;
                const locale = shared.find_from_name(inputs_data.obj[family], 'locale').val;
                const default_locale = shared.find_from_name(inputs_data.obj[family], 'default_locale').val;

                this.set_number_of_chars_val(this.textarea.value.length);

                if (number_of_chars > char_limit && locale === default_locale) {
                    this.set_char_limit_exceeded_bool(true);

                } else {
                    this.set_char_limit_exceeded_bool(false);
                }
            }

        } catch (er) {
            err(er, 113);
        }
    }

    render() {
        const {
            name,
            family,
            i,
            counter,
        } = this.props;
        const { val } = inputs_data.obj[family][i];

        const counter_el = counter
            ? (
                <span className={x.cls(['counter', this.ob.char_limit_exceeded ? 'char_limit_exceeded_counter' : ''])}>
                    {this.ob.number_of_chars}
                </span>
            )
            : null;

        return (
            <div className="input">
                <label
                    className="input_label"
                    data-text={`${name}_label_text`}
                    htmlFor={`${name}_input`}
                />
                <textarea
                    id={`${name}_input`}
                    className={this.ob.char_limit_exceeded ? 'char_limit_exceeded_textarea' : ''}
                    ref={textarea => { this.textarea = textarea; }}
                    value={val}
                    disabled={wf_shared.com2.inputs_disabled_2 && family !== 'settings'}
                    onInput={change_val.change_val.bind(null, family, i, 'is_not_select', null)}
                    onChange={() => null}
                />
                <Help {...this.props} />
                {counter_el}
            </div>
        );
    }
}

observer(Textarea);
