import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, configure } from 'mobx';
import * as analytics from 'js/analytics';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import * as change_val from 'js/change_val';
import * as els_state from 'js/els_state';

import { Help } from 'components/Help';

configure({ enforceActions: 'observed' });

export class Textarea extends React.Component {
    constructor(props) {
        super(props);

        ({
            name: this.name,
            family: this.family,
            counter: this.counter,
            char_limit: this.char_limit,
        } = this.props);

        this.textarea = React.createRef();

        this.ob = observable({
            number_of_chars: 0,
            char_limit_exceeded: false,
        });

        this.mut = {
            entered_one_char_in_textarea_after_focus: false,
        };

        this.counter_el = this.counter
            ? (
                <span className={x.cls(['counter', this.ob.char_limit_exceeded ? 'char_limit_exceeded_counter' : ''])}>
                    {this.ob.number_of_chars}
                </span>
            )
            : null;
    }

    componentDidMount() {
        this.resize_textarea(true);
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

    resize_textarea = async mount => {
        try {

            this.textarea.style.height = '';

            if (mount) {
                this.textarea.style.overflow = 'visible'; // needs to be here to resize options textareas properly on mount
            }

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
            if (this.counter) {
                const number_of_chars = this.textarea.value.length;
                const { val: locale } = inputs_data.obj[this.family].locale;
                const { val: default_locale } = inputs_data.obj[this.family].default_locale;

                this.set_number_of_chars_val(this.textarea.value.length);

                if (number_of_chars > this.char_limit && locale === default_locale) {
                    this.set_char_limit_exceeded_bool(true);

                } else {
                    this.set_char_limit_exceeded_bool(false);
                }
            }

        } catch (er) {
            err(er, 113);
        }
    }

    change_val = e => {
        try {
            change_val.change_val(this.family, this.name, 'is_not_select', null, e);

            if (!this.mut.entered_one_char_in_textarea_after_focus) {
                this.mut.entered_one_char_in_textarea_after_focus = true;

                analytics.send_event('textareas', `input-${this.family}-${this.name}`);
            }
        } catch (er) {
            err(er, 162);
        }
    }

    reset_entered_one_char_in_textarea_after_focus = () => {
        try {
            this.mut.entered_one_char_in_textarea_after_focus = false;

        } catch (er) {
            err(er, 163);
        }
    }

    render() {
        const { val } = inputs_data.obj[this.family][this.name];

        return (
            <div className="input">
                <label
                    className="input_label"
                    data-text={`${this.name}_label_text`}
                    htmlFor={`${this.name}_input`}
                />
                <textarea
                    id={`${this.name}_input`}
                    className={this.ob.char_limit_exceeded ? 'char_limit_exceeded_textarea' : ''}
                    ref={textarea => { this.textarea = textarea; }}
                    value={val}
                    disabled={els_state.com2.inputs_disabled_2 && this.family !== 'options'}
                    onInput={this.change_val}
                    onChange={() => null}
                    onBlur={this.reset_entered_one_char_in_textarea_after_focus}
                />
                <Help {...this.props} />
                <Counter
                    counter={this.counter}
                    ob={this.ob}
                />
            </div>
        );
    }
}

const Counter = observer(props => {
    const { counter, ob } = props;
    const { char_limit_exceeded, number_of_chars } = ob;

    return (
        counter ? (
            <span className={x.cls(['counter', char_limit_exceeded ? 'char_limit_exceeded_counter' : ''])}>
                {number_of_chars}
            </span>
        )
            : null
    );
});

observer(Textarea);
