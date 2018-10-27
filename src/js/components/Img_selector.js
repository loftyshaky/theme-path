'use strict';

import x from 'x';
import * as imgs from 'js/imgs';
import { inputs_data } from 'js/inputs_data';
import { Tr } from 'js/Tr';

import { Color } from 'components/Color';
import { Checkbox } from 'components/Checkbox';
import { Help } from 'components/Help';

import library_add_svg from 'svg/library_add';

import Svg from 'svg-inline-react';
import react from 'react';
import { observer } from 'mobx-react';

export class Img_selector extends react.Component {
    constructor(props) {
        super(props);
    }

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
        imgs.handle_files(e.target.files, this.props.family, this.props.i);
        imgs.reset_upload_btn_val();
    }
    //< browse_handle_files f

    drop_handle_files = e => {
        imgs.dehighlight_upload_box_on_drop(this.props.family, this.props.i);
        imgs.handle_files(e.dataTransfer.files, this.props.family, this.props.i);
    }

    render() {
        const also_use_img_as = this.props.name != 'icon' ?
            <span className='also_use_img_as' data-title='also_use_img_as_title'>
                <Svg src={library_add_svg} />
            </span>
            : null
        return (
            <div className='input'>
                <label
                    className='input_label img_selector_input_label'
                    data-text={this.props.name + '_label_text'}
                ></label>
                <div className='img_selector_box'>
                    <Tr
                        attr={{
                            className: 'upload_box',
                            onDragEnter: imgs.highlight_upload_box_on_drag_enter.bind(null, this.props.family, this.props.i),
                            onDragLeave: imgs.dehighlight_upload_box_on_drag_leave.bind(null, this.props.family, this.props.i),
                            onDrop: this.drop_handle_files
                        }}
                        tag='span'
                        name='upload_box'
                        state={inputs_data.obj[this.props.family][this.props.i].highlight_upload_box}
                    >
                        <input
                            className='upload_btn'
                            id={this.props.name + '_file'}
                            type='file'
                            accept='image/*'
                            value={imgs.ob.file_input_value}
                            onChange={this.browse_handle_files}
                        />
                        <span className='upload_box_what_to_do_message'>
                            <label
                                className='upload_box_browse_label'
                                htmlFor={this.props.name + '_file'}
                                data-text='upload_box_label_text'
                            ></label>
                        </span>
                    </Tr>

                    <Color
                        {...this.props}
                        color_input_type='img'
                        add_help={false}
                    />
                  {also_use_img_as}
                    <Checkbox
                        {...this.props}
                        special_checkbox='default'
                    />
                </div>
                <Help name={this.props.name} add_help={this.props.add_help} />
            </div>
        );
    }
}

Img_selector = observer(Img_selector);