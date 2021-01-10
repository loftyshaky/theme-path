import React from 'react';
import { observer } from 'mobx-react';

import * as tints from 'js/tints';

import { Number } from 'components/Number';
import { Checkbox } from 'components/Checkbox';
import { Help_btn } from 'components/Help_btn';

export class Tint extends React.Component {
    render() {
        const { name } = this.props;

        return (
            <div
                className="input tint_input"
            >
                <label
                    className="input_label"
                    data-text={`${name}_label_text`}
                />
                <div className="tint_input_inner">
                    <div className="tint_inputs">
                        {
                            Object.entries(tints.con.types).map(([type, type_i], i) => (
                                <Number
                                // eslint-disable-next-line react/no-array-index-key
                                    key={i}
                                    {...this.props}
                                    type={type}
                                    type_i={type_i}
                                />
                            ))
                        }
                    </div>
                    <Checkbox
                        {...this.props}
                        checkbox_type="disabled"
                    />
                    <Checkbox
                        {...this.props}
                        checkbox_type="default"
                    />
                </div>
                <Help_btn {...this.props} />
            </div>
        );
    }
}

observer(Tint);
