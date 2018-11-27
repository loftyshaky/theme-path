import React from 'react';
import { observer } from 'mobx-react';
import { ChromePicker } from 'react-color';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import * as color_pickiers from 'js/color_pickiers';
import * as enter_click from 'js/enter_click';
import * as wf_shared from 'js/work_folder/wf_shared';

import { Tr } from 'components/Tr';
import { Checkbox } from 'components/Checkbox';
import { Help } from 'components/Help';
//--

export const Color = observer(props => {
    const { name, family, i, color_input_type } = props;

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

    const disabled_checkbox = family === 'tints' ? (
        <Checkbox
            {...props}
            special_checkbox="disabled"
        />
    ) : null;

    return (
        <span className={x.cls(['input', color_input_type === 'img' ? 'tall_color_input' : 'ordinary_color_input'])}>
            <span className="ordinary_color_input_inner">
                {label}
                <Color_input_vizualization
                    family={family}
                    i={i}
                    color_input_type={color_input_type}
                />
                {disabled_checkbox}
                {default_checkbox}
            </span>
            <Help {...props} />
        </span>
    );
});

const Color_input_vizualization = observer(props => {
    const { family, i, color_input_type } = props;
    const color = inputs_data.obj[family][i].color || inputs_data.obj[family][i].val;
    color_pickiers.mut.current_pickied_color.hex = color;

    return (
        <span
            className={x.cls(['color_input_vizualization', color_input_type === 'img' ? 'tall_color_input_vizualization' : null])}
            role="button"
            tabIndex={wf_shared.com2.inputs_disabled_1}
            data-family={family}
            data-i={i}
            style={{ backgroundColor: color }}
            onKeyUp={enter_click.open_color_pickier_on_enter}
        >
            <Color_pickier
                family={family}
                i={i}
                color={color}
            />
        </span>
    );
});

const Color_pickier = observer(props => {
    const { family, i, color } = props;
    const { color_pickiers_position } = inputs_data.obj[family][i] || false;
    const { color_pickier_is_visible } = inputs_data.obj[family][i] || false;

    return (
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
                <Chrome_picker
                    family={family}
                    i={i}
                    color={color}
                />
                <Color_pickier_ok_btn
                    family={family}
                    i={i}
                />
            </Tr>
        </div>
    );
});

const Chrome_picker = observer(props => {
    const on_change = picked_color => {
        try {
            color_pickiers.mut.current_pickied_color = picked_color;
            color_pickiers.set_color_input_vizualization_color(family, i, picked_color);

        } catch (er) {
            err(er, 95);
        }
    };

    const { family, i } = props;

    return (
        <ChromePicker
            color={props.color}
            disableAlpha={family !== 'images'}
            onChange={on_change}
        />
    );
});

const Color_pickier_ok_btn = observer(props => {
    const { family, i } = props;

    const on_click = () => {
        try {
            color_pickiers.accept_color(family, i);

        } catch (er) {
            err(er, 96);
        }
    };

    return (
        <button
            className="color_ok_btn"
            type="button"
            onClick={on_click}
        >
            OK
        </button>
    );
});
