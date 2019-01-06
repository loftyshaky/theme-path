import React from 'react';
import { observer } from 'mobx-react';
import { ChromePicker } from 'react-color';
import * as analytics from 'js/analytics';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import * as color_pickiers from 'js/color_pickiers';
import * as enter_click from 'js/enter_click';
import * as wf_shared from 'js/work_folder/wf_shared';

import { Tr } from 'components/Tr';
import { Checkbox } from 'components/Checkbox';
import { Help } from 'components/Help';
//--

export class Color extends React.Component {
    constructor(props) {
        super(props);

        ({ color_input_type: this.color_input_type, name: this.name, family: this.family, i: this.i } = this.props);

        this.label = this.color_input_type === 'color' ? (
            <label
                className="input_label color_input_label"
                data-text={`${this.name}_label_text`}
                htmlFor={this.name}
            />
        ) : null;

        this.default_checkbox = this.color_input_type === 'color' ? (
            <Checkbox
                {...props}
                special_checkbox="default"
            />
        ) : null;

        this.disabled_checkbox = this.family === 'tints' ? (
            <Checkbox
                {...props}
                special_checkbox="disabled"
            />
        ) : null;

        this.color_input = React.createRef();
    }

    componentDidMount() {
        try {
            sb(this.color_input.current, '.chrome-picker div').addEventListener('mousedown', color_pickiers.defocus_color_field);

        } catch (er) {
            err(er, 175);
        }
    }

    componentWillUnmount() {
        try {
            sb(this.color_input.current, '.chrome-picker div').removeEventListener('mousedown', color_pickiers.defocus_color_field);

        } catch (er) {
            err(er, 176);
        }
    }

    render() {
        return (
            <span
                className={x.cls(['input', this.color_input_type === 'img' ? 'tall_color_input' : 'ordinary_color_input'])}
                ref={this.color_input}
            >
                <span className="ordinary_color_input_inner">
                    {this.label}
                    <Color_input_vizualization
                        family={this.family}
                        name={this.name}
                        i={this.i}
                        color_input_type={this.color_input_type}
                    />
                    {this.disabled_checkbox}
                    {this.default_checkbox}
                </span>
                <Help {...this.props} />
            </span>
        );
    }
}

const Color_input_vizualization = observer(props => {
    const { family, name, i, color_input_type } = props;
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
            onMouseUp={color_pickiers.focus_input_and_select_all_text_in_it}
            onKeyUp={enter_click.open_color_pickier_on_enter}
        >
            <Color_pickier
                family={family}
                name={name}
                i={i}
                color={color}
            />
        </span>
    );
});

const Color_pickier = observer(props => {
    const { family, i, name, color } = props;
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
                    name={name}
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

            if (!inputs_data.obj[family][i].changed_color_once_after_focus) {
                inputs_data.obj[family][i].changed_color_once_after_focus = true;

                analytics.send_event('color_pickiers', `changed_color-${family}-${name}`);
            }

        } catch (er) {
            err(er, 95);
        }
    };

    const { family, name, i } = props;

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

observer(Color);
