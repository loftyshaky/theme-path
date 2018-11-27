import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import * as set_default_or_disabled from 'js/set_default_or_disabled';
import * as enter_click from 'js/enter_click';
import { inputs_data } from 'js/inputs_data';
import * as wf_shared from 'js/work_folder/wf_shared';

import checkmark_svg from 'svg/checkmark';

//--

export const Checkbox = observer(props => {
    const { name, family, i, special_checkbox } = props;
    const checkbox_id = inputs_data.obj[family][i].key;

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
                    tabIndex={wf_shared.com2.inputs_disabled_1}
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
