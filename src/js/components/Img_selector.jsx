import React from 'react';
import { observer } from 'mobx-react';

import { inputs_data } from 'js/inputs_data';
import * as imgs from 'js/imgs';

import { Tr } from 'components/Tr';
import { Color } from 'components/Color';
import { Checkbox } from 'components/Checkbox';
import { Help } from 'components/Help';

//--

export class Img_selector extends React.Component {
    componentDidMount() {
        window.addEventListener('drop', imgs.prevent_default_dnd_actions);
        window.addEventListener('dragover', imgs.prevent_default_dnd_actions);
    }

    componentWillUnmount() {
        window.removeEventListener('drop', imgs.prevent_default_dnd_actions);
        window.removeEventListener('dragover', imgs.prevent_default_dnd_actions);
    }

    //> browse_handle_files f
    browse_handle_files = e => {
        const { family, i } = this.props;

        imgs.handle_files(e.target.files, family, i);
        imgs.reset_upload_btn_val();
    }
    //< browse_handle_files f

    drop_handle_files = e => {
        const { family, i } = this.props;

        imgs.dehighlight_upload_box_on_drop(family, i);
        imgs.handle_files(e.dataTransfer.files, family, i);
    }

    render() {
        const {
            name,
            family,
            i,
            add_help,
        } = this.props;

        return (
            <div className="input">
                <label
                    className="input_label img_selector_input_label"
                    data-text={`${name}_label_text`}
                />
                <div className="img_selector_box">
                    <Tr
                        attr={{
                            className: 'upload_box',
                            onDragEnter: imgs.highlight_upload_box_on_drag_enter.bind(null, family, i),
                            onDragLeave: imgs.dehighlight_upload_box_on_drag_leave.bind(null, family, i),
                            onDrop: this.drop_handle_files,
                        }}
                        tag="span"
                        name="upload_box"
                        state={inputs_data.obj[family][i].highlight_upload_box}
                    >
                        <input
                            className="upload_btn"
                            id={`${name}_file`}
                            type="file"
                            accept="image/*"
                            value={imgs.ob.file_input_value}
                            onChange={this.browse_handle_files}
                        />
                        <span className="upload_box_what_to_do_message">
                            <label
                                className="upload_box_browse_label"
                                htmlFor={`${name}_file`}
                                data-text="upload_box_label_text"
                            />
                        </span>
                    </Tr>

                    <Color
                        {...this.props}
                        color_input_type="img"
                        add_help={false}
                    />
                    <Checkbox
                        {...this.props}
                        special_checkbox="default"
                    />
                </div>
                <Help name={name} add_help={add_help} />
            </div>
        );
    }
}

observer(Img_selector);
