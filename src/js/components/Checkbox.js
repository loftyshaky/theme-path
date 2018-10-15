'use strict';

import x from 'x';
import checkmark_svg from 'svg/checkmark';

import { inputs_data } from 'js/inputs_data';

import react from 'react';
import { observer } from "mobx-react";
import Svg from 'svg-inline-react';

export let Checkbox = props => {
    const checkbox_id = props.name + '_checkbox';

    return (
        <span className='img_selector_checkbox_w'>
            <label className='checkbox_label'>
                <input
                    className='checkbox'
                    type='checkbox'
                    id={checkbox_id}
                    checked={inputs_data.obj[props.family][props.i][props.special_checkbox]}
                    onChange={()=> null}
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