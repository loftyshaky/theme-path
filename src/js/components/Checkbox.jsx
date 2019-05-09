import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';
import * as r from 'ramda';
import * as analytics from 'js/analytics';

import * as set_default_or_disabled from 'js/set_default_or_disabled';
import * as enter_click from 'js/enter_click';
import { inputs_data } from 'js/inputs_data';
import * as els_state from 'js/els_state';
import * as change_val from 'js/change_val';

import { Tr } from 'components/Tr';

import checkmark_svg from 'svg/checkmark';

//--

export const Checkbox = observer(props => {
    const { name, family, special_checkbox } = props;

    const change_checkbox_val = e => {
        try {
            change_val.change_val(family, name, e.target.checked, null);

            analytics.send_event('checkboxes', `${e.target.checked ? 'checked' : 'unchecked'}-${family}-${name}`);

        } catch (er) {
            err(er, 152);
        }
    };

    const checkbox_id = inputs_data.obj[family][name].key;
    const is_special_checkbox = special_checkbox;

    const on_change = r.ifElse(() => is_special_checkbox,
        e => {
            if (name !== 'icon') {
                set_default_or_disabled.set_default_or_disabled(family, name, special_checkbox);

            } else {
                set_default_or_disabled.set_default_icon(family, name);
            }

            analytics.send_event('checkboxes', `${e.target.checked ? 'checked' : 'unchecked'}-${family}-${name}-${special_checkbox || ''}`);
        },

        e => change_checkbox_val(e));

    return (
        <Tr
            attr={{
                className: is_special_checkbox ? 'img_selector_checkbox_w' : 'input checkbox_input',
            }}
            tag="div"
            name="gen"
            state={!inputs_data.obj[family][name].hidden}
        >
            <label className="checkbox_label">
                <input
                    className="checkbox"
                    type="checkbox"
                    id={checkbox_id}
                    checked={is_special_checkbox ? inputs_data.obj[family][name][special_checkbox] : inputs_data.obj[family][name].val}
                    onChange={on_change}
                />
                <span
                    className="checkbox_checkmark_w"
                    role="button"
                    tabIndex={els_state.com2.inputs_disabled_1}
                    onKeyUp={enter_click.simulate_click_on_enter}
                >
                    <Svg src={checkmark_svg} />
                </span>
            </label>
            <label
                data-text={special_checkbox ? `${special_checkbox}_checkbox_label_text` : `${name}_label_text`}
                htmlFor={checkbox_id}
            />
        </Tr>
    );
});
