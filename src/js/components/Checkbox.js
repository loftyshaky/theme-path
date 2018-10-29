'use strict';

import x from 'x';
import * as set_default_or_disabled from 'js/set_default_or_disabled';
import checkmark_svg from 'svg/checkmark';

import { inputs_data } from 'js/inputs_data';

import react from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

export let Checkbox = props => {
    const checkbox_id = x.unique_id();

    return (
        <span className='img_selector_checkbox_w'>
            <label className='checkbox_label'>
                <input
                    className='checkbox'
                    type='checkbox'
                    id={checkbox_id}
                    checked={inputs_data.obj[props.family][props.i][props.special_checkbox]}
                    onChange={props.name != 'icon' ? set_default_or_disabled.set_default_or_disabled.bind(null, props.family, props.i, props.special_checkbox) : set_default_or_disabled.set_default_icon.bind(null, props.family, props.i)}
                />
                <span className='checkbox_checkmark_w'>
                    <Svg src={checkmark_svg} />
                </span>
            </label>
            <label
                data-text={props.special_checkbox ? props.special_checkbox + '_checkbox_label_text' : props.name + '_label_text'}
                htmlFor={checkbox_id}
            ></label>
        </span>
    );
};

Checkbox = observer(Checkbox);