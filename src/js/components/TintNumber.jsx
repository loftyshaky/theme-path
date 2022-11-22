import React from 'react';
import { observer } from 'mobx-react';

import { inputs_data } from 'js/inputs_data';
import * as els_state from 'js/els_state';
import * as tints from 'js/tints';

export class TintNumber extends React.Component {
    render() {
        const { family, name, type, type_i } = this.props;
        const { val } = inputs_data.obj[family][name];
        const id = `${name}_${type}_number`;

        return (
            <div className='number_input_w'>
                <label className='number_label' htmlFor={id}>
                    {type.toUpperCase()}
                </label>
                <input
                    id={id}
                    className='number_input'
                    type='text'
                    value={val[type_i]}
                    disabled={els_state.com2.inputs_disabled_2 && family !== 'options'}
                    onInput={(e) => {
                        tints.change_sub_val(family, name, e.target.value, type_i);
                    }}
                    onChange={() => null}
                    onKeyDown={(e) => {
                        tints.change_val_by_mouse_wheel(e, family, name, type_i);
                    }}
                />
            </div>
        );
    }
}

observer(TintNumber);
