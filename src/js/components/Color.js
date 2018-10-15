'use strict';

import x from 'x';

import * as convert_color from 'js/convert_color';
import * as color_pickiers from 'js/color_pickiers';
import { inputs_data } from 'js/inputs_data';
import { Tr } from 'js/Tr';

import { Checkbox } from 'components/Checkbox';
import { Help } from 'components/Help';

import react from 'react';
import { observer } from "mobx-react";
import { SketchPicker } from 'react-color';

export let Color = props => {
    const color_after = inputs_data.obj[props.family][props.i].color || inputs_data.obj[props.family][props.i].val;

    const label = props.color_input_type == 'color' ?
        <label
            className='input_label color_input_label'
            data-text={props.name + '_label_text'}
            htmlFor={props.name}
        ></label>
        : null;

    const default_checkbox = props.color_input_type == 'color' ?
        <Checkbox
            {...props}
            special_checkbox='default'
        />
        : null;

    const disable_checkbox = props.family == 'tints' ?
        <Checkbox
            {...props}
            special_checkbox='disable'
        />
        : null;

    const color_pickier_state = inputs_data.obj[props.family][props.i].color_pickier_is_visible || false;
    const color_pickiers_position = inputs_data.obj[props.family][props.i].color_pickiers_position || false;

    return (
        <span className={x.cls(['input', props.color_input_type == 'img' ? 'tall_color_input' : 'ordinary_color_input'])}>
            {label}
            <span
                className={x.cls(['color_input_vizualization', props.color_input_type == 'img' ? 'tall_color_input_vizualization' : null])}
                data-family={props.family}
                data-i={props.i}
                style={{ backgroundColor: color_after }}
            >
                <div
                    className='color_pickier_w'
                    style={{ [color_pickiers_position]: props.family == 'images' ? '40px' : '26px' }}>
                    <Tr attr={{
                        className: 'color_pickier'
                    }}
                        tag='div'
                        name='gen'
                        state={color_pickier_state}
                    >
                        <SketchPicker
                            color={color_after}
                            disableAlpha={true}
                            onChange={color_pickiers.set_color_input_vizualization_color.bind(null, props.family, props.i)}
                        /><button
                            className='color_ok_btn'
                            onClick={color_pickiers.accept_color.bind(null, props.family, props.i)}

                        >OK</button>
                    </Tr>
                </div>
            </span>
            {disable_checkbox}
            {default_checkbox}
            <Help name={props.name} />
        </span>
    );
};

Color = observer(Color);