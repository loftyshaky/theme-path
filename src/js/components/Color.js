'use strict';

import x from 'x';

import { Checkbox } from 'components/Checkbox';
import { Help } from 'components/Help';

import react from 'react';
import { SketchPicker } from 'react-color';

export let Color = props => {
    const label = props.type == 'color' ?
        <label
            className='input_label color_input_label'
            data-text={props.name + '_label_text'}
            htmlFor={props.name}
        ></label>
        : null;

    const default_checkbox_and_help = props.type == 'color' ?
        <react.Fragment>
            <Checkbox
                name={props.name}
                is_default_checkbox={true}
            />
            <Help name={props.name} />
        </react.Fragment>
        : null

    return (
        <span className={x.cls(['input', props.type == 'img' ? 'tall_color_input' : 'ordinary_color_input'])}>
            {label}
            <span
                className={x.cls(['color_input_vizualization', props.type == 'img' ? 'tall_color_input_vizualization' : null])}
                data-name={props.name}
                style={{ backgroundColor: 'red' }}
            >
                <div
                    className='color_pickier_w'
                    style={{ top: '-1px' }}>
                    <div>
                        <SketchPicker
                            color={'white'}
                            disableAlpha={props.type == 'color' ? false : true}
                        /><button
                            className='color_ok_btn'
                        >OK</button>
                    </div>
                </div>
            </span>
            {default_checkbox_and_help}
        </span>
    );
};