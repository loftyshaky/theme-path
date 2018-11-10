import React from 'react';
import { observer } from 'mobx-react';
import { ChromePicker } from 'react-color';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import * as color_pickiers from 'js/color_pickiers';
import * as enter_click from 'js/enter_click';

import { Tr } from 'components/Tr';
import { Checkbox } from 'components/Checkbox';
import { Help } from 'components/Help';
//--

export const Color = observer(props => {
    const { name, family, i, color_input_type } = props;
    const { color_pickier_is_visible } = inputs_data.obj[family][i] || false;
    const { color_pickiers_position } = inputs_data.obj[family][i] || false;
    const color = inputs_data.obj[family][i].color || inputs_data.obj[family][i].val;

    const on_change = picked_color => {
        try {
            color_pickiers.set_color_input_vizualization_color(family, i, picked_color);

        } catch (er) {
            err(er, 95);
        }
    };

    const on_click = picked_color => {
        try {
            color_pickiers.accept_color(family, i, picked_color);

        } catch (er) {
            err(er, 96);
        }
    };

    const label = color_input_type === 'color' ? (
        <label
            className="input_label color_input_label"
            data-text={`${name}_label_text`}
            htmlFor={name}
        />
    ) : null;

    const default_checkbox = color_input_type === 'color' ? (
        <Checkbox
            {...props}
            special_checkbox="default"
        />
    ) : null;

    const disable_checkbox = family === 'tints' ? (
        <Checkbox
            {...props}
            special_checkbox="disable"
        />
    ) : null;

    return (
        <span className={x.cls(['input', color_input_type === 'img' ? 'tall_color_input' : 'ordinary_color_input'])}>
            <span className="ordinary_color_input_inner">
                {label}
                <span
                    className={x.cls(['color_input_vizualization', color_input_type === 'img' ? 'tall_color_input_vizualization' : null])}
                    role="button"
                    tabIndex="0"
                    data-family={family}
                    data-i={i}
                    style={{ backgroundColor: color }}
                    onKeyUp={enter_click.open_color_pickier_on_enter}
                >
                    <div
                        className="color_pickier_w"
                        style={{ [color_pickiers_position]: family === 'images' ? '40px' : '26px' }}
                    >
                        <Tr
                            attr={{
                                className: 'color_pickier',
                            }}
                            tag="div"
                            name="gen"
                            state={color_pickier_is_visible}
                        >
                            <ChromePicker
                                color={color}
                                disableAlpha
                                onChange={on_change}
                            />
                            <button
                                className="color_ok_btn"
                                type="button"
                                onClick={on_click}
                            >
                                OK
                            </button>
                        </Tr>
                    </div>
                </span>
                {disable_checkbox}
                {default_checkbox}
            </span>
            <Help {...props} />
        </span>
    );
});
