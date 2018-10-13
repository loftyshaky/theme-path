'use strict';

import x from 'x';

import { Color } from 'components/Color';
import { Checkbox } from 'components/Checkbox';
import { Help } from 'components/Help';

import library_add_svg from 'svg/library_add';

import Svg from 'svg-inline-react';
import react from 'react';

export const Img_selector = props => {
    return (
        <div className='input'>
            <label
                className='input_label img_selector_input_label'
                data-text={props.name + '_label_text'}
            ></label>
            <div className='img_selector_box'>
                <span className='upload_box'>
                    <div className={x.cls(['upload_box_loader', 'none'])}></div>
                    <input
                        className='upload_btn'
                        id={props.name + '_file'}
                        type='file'
                        accept='image/*'
                    />
                    <span className='upload_box_what_to_do_message'>
                        <label
                            className='upload_box_browse_label'
                            htmlFor={props.name + '_file'}
                            data-text='upload_box_label_text'
                        ></label>
                        {' '}
                    </span>
                </span>
                <Color
                    {...props}
                    color_input_type='img'
                />
                <span className='also_use_img_as' data-title='also_use_img_as_title'>
                    <Svg src={library_add_svg} />
                </span>
                <Checkbox
                    {...props}
                    special_checkbox='default'
                />
            </div>
            <Help name={props.name} />
        </div>
    );
}