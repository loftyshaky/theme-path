'use strict';


import { inputs_data } from 'js/inputs_data';

import { Hr } from 'components/Hr';
import { Textarea } from 'components/Textarea';
import { Select } from 'components/Select';
import { Img_selector } from 'components/Img_selector';
import { Color } from 'components/Color';

import react from 'react';

export const Input_block = props => {
    const hr = props.hr ? <Hr name={props.name} /> : null;

    return (
        <react.Fragment>
            {hr}
            <div className={props.name == 'colors' || props.name == 'tints' ? 'colors_and_tints_input_block' : null}>
                {
                    inputs_data.obj[props.name].map((item, i) => {
                        const Component = components[item.type];
                        const color_input_type = item.type == 'color' ? 'color' : null;

                        return (
                            < Component {...item} i={i} color_input_type={color_input_type} add_help />
                        );
                    })
                }
            </div>
        </react.Fragment>
    )
}

//> varibles t
const components = {
    textarea: Textarea,
    select: Select,
    img_selector: Img_selector,
    color: Color
};
//< varibles t