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
            {
                inputs_data[props.name].map(item => {
                    const Component = components[item.type];

                    return (
                        < Component {...item} />
                    );
                })
            }
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