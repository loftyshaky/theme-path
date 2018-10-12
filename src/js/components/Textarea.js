'use strict';

import x from 'x';

import { Help } from 'components/Help';

import react from 'react';

export class Textarea extends react.Component {
    constructor(props) {
        super(props);

        this.textarea = react.createRef();
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
        return (
            <react.Fragment>
                <div className='input'>
                    <label
                        className='input_label'
                        data-text={this.props.name + '_label_text'}
                        htmlFor={this.props.name + '_input'}
                    ></label>
                    <textarea
                        id={this.props.name + '_input'}
                        ref={this.textarea}
                        onInput={this.resize_textarea}
                    ></textarea>
                     <Help {...this.props} />
                </div>
            </react.Fragment>
        );
    }
}