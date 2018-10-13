'use strict';

import x from 'x';

import shared from 'js/shared';
import * as convert_color from 'js/convert_color';
import { inputs_data } from 'js/inputs_data';

import { Checkbox } from 'components/Checkbox';
import { Help } from 'components/Help';

import react from 'react';
import { observer } from "mobx-react";
import { SketchPicker } from 'react-color';

export let Color = props => {
    convert_color.convert_color_to_hsla(props.family, props.i, inputs_data.obj[props.family][props.i].value);

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

    return (
        <span className={x.cls(['input', props.color_input_type == 'img' ? 'tall_color_input' : 'ordinary_color_input'])}>
            {label}
            <span
                className={x.cls(['color_input_vizualization', props.color_input_type == 'img' ? 'tall_color_input_vizualization' : null])}
                data-name={props.name}
                style={{ backgroundColor: inputs_data.obj[props.family][props.i].color_input_vizualization  || inputs_data.obj[props.family][props.i].value }}
            >
                <div
                    className='color_pickier_w'
                    style={{ top: '-1px' }}>
                    <div>
                        <SketchPicker
                            color={'white'}
                            disableAlpha={props.color_input_type == 'color' ? false : true}
                        /><button
                            className='color_ok_btn'
                        >OK</button>
                    </div>
                </div>
            </span>
            {disable_checkbox}
            {default_checkbox}
            <Help name={props.name} />
        </span>
    );
};

Color = observer(Color);