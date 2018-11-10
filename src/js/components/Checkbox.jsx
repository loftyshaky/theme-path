import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import x from 'x';
import * as set_default_or_disabled from 'js/set_default_or_disabled';
import * as enter_click from 'js/enter_click';
import { inputs_data } from 'js/inputs_data';

import checkmark_svg from 'svg/checkmark';

//--

export const Checkbox = observer(props => {
    const checkbox_id = x.unique_id();
    const {
        name,
        family,
        i,
        special_checkbox,
    } = props;

    return (
        <span className="img_selector_checkbox_w">
            <label className="checkbox_label">
                <input
                    className="checkbox"
                    type="checkbox"
                    id={checkbox_id}
                    checked={inputs_data.obj[family][i][special_checkbox]}
                    onChange={
                        name !== 'icon'
                            ? set_default_or_disabled.set_default_or_disabled.bind(null, family, i, special_checkbox)
                            : set_default_or_disabled.set_default_icon.bind(null, family, i)
                    }
                />
                <span
                    className="checkbox_checkmark_w"
                    role="button"
                    tabIndex="0"
                    onKeyUp={enter_click.simulate_click_on_enter}
                >
                    <Svg src={checkmark_svg} />
                </span>
            </label>
            <label
                data-text={special_checkbox ? `${special_checkbox}_checkbox_label_text` : `${name}_label_text`}
                htmlFor={checkbox_id}
            />
        </span>
    );
});
