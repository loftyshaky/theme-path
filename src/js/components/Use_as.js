'use strict';

import { inputs_data } from 'js/inputs_data';
import { Tr } from 'js/Tr';

import { Checkbox } from 'components/Checkbox';

import close_svg from 'svg/close';

import react from 'react';
import { observer } from 'mobx-react';
import * as r from 'ramda';
import Svg from 'svg-inline-react';

export let Use_as = props => {
    const use_as_is_visible = inputs_data.obj[props.family][props.i].use_as_is_visible;
    const use_as_position = inputs_data.obj[props.family][props.i].use_as_position;

    return (
        <span
            className='use_as_w2'
            style={{ [use_as_position]: '41px' }}
        >
            <Tr
                attr={{
                    className: 'use_as'
                }}
                tag='span'
                name='gen'
                state={use_as_is_visible}
            >
                <button className='close_btn'>
                    <Svg src={close_svg} />
                </button>
                <span className='use_as_label' data-text='use_as_title'></span>
                {
                    Object.values(inputs_data.obj[props.family]).map((item, i) => {
                        if (props.name != item.name) {
                            return (
                                <Checkbox
                                    key={item.key}
                                    use_as_name={props.name}
                                    name={item.name}
                                    family={item.family}
                                    i={i}
                                    use_as_checkbox={true}
                                />
                            )
                        }
                    })
                }
            </Tr>
        </span>
    );
}

Use_as = observer(Use_as);