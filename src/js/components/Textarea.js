'use strict';

import x from 'x';

import * as change_val from 'js/change_val';
import { inputs_data } from 'js/inputs_data';

import { Help } from 'components/Help';

import react from 'react';
import { observer } from "mobx-react";

export class Textarea extends react.Component {
    constructor(props) {
        super(props);

        this.textarea = react.createRef();
    }
    componentDidMount() {
        this.resize_textarea();
    }

    async componentDidUpdate() {
        this.resize_textarea();

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

    render() {
        const val = inputs_data.obj[this.props.family][this.props.i].val;

        return (
            <div className='input'>
                <label
                    className='input_label'
                    data-text={this.props.name + '_label_text'}
                    htmlFor={this.props.name + '_input'}
                ></label>
                <textarea
                    id={this.props.name + '_input'}
                    ref={this.textarea}
                    value={val}
                    onInput={change_val.change_val.bind(null, this.props.family, this.props.i, 'is_not_select', null)}
                    onChange={() => null}
                ></textarea>
                <Help {...this.props} />
            </div>
        );
    }
}

Textarea = observer(Textarea);