'use strict';

import x from 'x';
import checkmark_svg from 'svg/checkmark';

import Svg from 'svg-inline-react';
import react from 'react';

export const Checkbox = props => {
    const checkbox_id = props.name + '_checkbox';

    return (
        <span className='img_selector_checkbox_w'>
            <label className='checkbox_label'>
                <input
                    className='checkbox'
                    type='checkbox'
                    id={checkbox_id}
                />
                <span className='checkbox_checkmark_w'>
                    <Svg src={checkmark_svg} />
                </span>
            </label>
            <label
                data-text={props.is_default_checkbox ? 'default_checkbox_label' : props.name + '_label_text'}
                htmlFor={checkbox_id}
            ></label>
        </span>
    );
};