import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import * as imgs from 'js/imgs';
import * as enter_click from 'js/enter_click';
import * as els_state from 'js/els_state';

import { Tr } from 'components/Tr';
import { Color } from 'components/Color';
import { Checkbox } from 'components/Checkbox';
import { HelpBtn } from 'components/HelpBtn';

// eslint-disable-next-line import/no-extraneous-dependencies
const remote = require('@electron/remote');

export class ImgSelector extends React.Component {
    constructor(props) {
        super(props);

        ({ family: this.family, name: this.name } = this.props);
    }

    componentDidMount() {
        try {
            window.addEventListener('drop', imgs.prevent_default_dnd_actions);
            window.addEventListener('dragover', imgs.prevent_default_dnd_actions);
        } catch (er) {
            err(er, 99);
        }
    }

    componentWillUnmount() {
        try {
            window.removeEventListener('drop', imgs.prevent_default_dnd_actions);
            window.removeEventListener('dragover', imgs.prevent_default_dnd_actions);
        } catch (er) {
            err(er, 100);
        }
    }

    //> browse_handle_files f
    browse_handle_files = () => {
        try {
            const file_path = remote.dialog.showOpenDialogSync({
                properties: ['openFile'],
                title: `${x.msg(`${this.name}_label_text`)} - ${this.name}`,
                filters: [{ name: '', extensions: imgs.select_allowed_extension(this.name) }],
            });

            if (file_path) {
                imgs.handle_files('browse_upload', file_path[0], this.family, this.name);
                imgs.reset_upload_btn_val();
            }
        } catch (er) {
            err(er, 101);
        }
    };
    //< browse_handle_files f

    drop_handle_files = (e) => {
        try {
            imgs.dehighlight_upload_box_on_drop(this.family, this.name);
            imgs.handle_files('dnd_upload', e.dataTransfer.files, this.family, this.name);
        } catch (er) {
            err(er, 102);
        }
    };

    render() {
        const { img_dims } = inputs_data.obj[this.family][this.name];
        const upload_box_label_text = x.msg('upload_box_label_text');

        return (
            <div className='input'>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label
                    className='input_label img_selector_input_label'
                    data-text={`${this.name}_label_text`}
                />
                <div className='img_selector_box'>
                    <Tr
                        attr={{
                            className: 'upload_box',
                            onDragEnter: imgs.highlight_upload_box_on_drag_enter.bind(
                                null,
                                this.family,
                                this.name,
                            ),
                            onDragLeave: imgs.dehighlight_upload_box_on_drag_leave.bind(
                                null,
                                this.family,
                                this.name,
                            ),
                            onDrop: this.drop_handle_files,
                        }}
                        tag='span'
                        name='upload_box'
                        state={inputs_data.obj[this.family][this.name].highlight_upload_box}
                    >
                        <span className='upload_box_what_to_do_message'>
                            <label
                                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                                role='button'
                                className='upload_box_browse_label'
                                htmlFor={`${this.name}_file`}
                                tabIndex={els_state.com2.inputs_disabled_1}
                                onKeyUp={enter_click.simulate_click_on_enter}
                                onClick={this.browse_handle_files}
                            >
                                <span className='upload_box_browse_label_part choose_img'>
                                    {upload_box_label_text}
                                </span>
                                <span className='upload_box_browse_label_part img_dims'>
                                    {img_dims.width && img_dims.height
                                        ? `${img_dims.width}x${img_dims.height}`
                                        : upload_box_label_text}
                                </span>
                            </label>
                        </span>
                    </Tr>
                    <Color {...this.props} color_input_type='img' add_help={false} />
                    <Checkbox {...this.props} checkbox_type='default' />
                </div>
                <HelpBtn {...this.props} />
            </div>
        );
    }
}

observer(ImgSelector);
