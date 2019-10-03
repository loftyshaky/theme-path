import React from 'react';
import { observer } from 'mobx-react';
import Pickr from '@simonwep/pickr';
import tinycolor from 'tinycolor2';

import x from 'x';
import * as analytics from 'js/analytics';
import { inputs_data } from 'js/inputs_data';
import * as els_state from 'js/els_state';
import * as color_pickiers from 'js/color_pickiers';
import * as enter_click from 'js/enter_click';
import * as options from 'js/options';

import { Checkbox } from 'components/Checkbox';
import { Help } from 'components/Help';

import '@simonwep/pickr/dist/themes/nano.min.css';

export class Color extends React.Component {
    constructor(props) {
        super(props);

        ({
            name: this.name,
            family: this.family,
            type: this.type,
        } = this.props);

        this.label = this.type === 'color' ? (
            <label
                className="input_label color_input_label"
                data-text={`${this.name}_label_text`}
                htmlFor={this.name}
            />
        ) : null;

        this.default_checkbox = this.type === 'color' ? (
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
            sb(this.color_input.current, '.pcr-result').addEventListener('mousedown', color_pickiers.defocus_color_field);

        } catch (er) {
            err(er, 175);
        }
    }

    render() {
        return (
            <span
                className={x.cls(['input',
                    this.type === 'img_selector' ? 'tall_color_input' : 'ordinary_color_input',
                    this.name === 'clear_new_tab_video' ? 'none' : null,
                ])}
                ref={this.color_input}
            >
                <span className="ordinary_color_input_inner">
                    {this.label}
                    <Color_input_vizualization
                        family={this.family}
                        name={this.name}
                        type={this.type}
                    />
                    {this.disabled_checkbox}
                    {this.default_checkbox}
                </span>
                <Help {...this.props} />
            </span>
        );
    }
}

class Color_input_vizualization extends React.Component {
    constructor(props) {
        super(props);

        ({
            name: this.name,
            family: this.family,
            type: this.type,
        } = this.props);

        this.pickr = null;
        this.alpha_enabled = this.family === 'images' && color_pickiers.con.no_alpha.indexOf(this.name) === -1;
        this.color_pickier_w = React.createRef();
        this.color_input_vizualization = React.createRef();
    }

    componentDidMount() {
        this.pickr = new Pickr({
            container: this.color_pickier_w.current,
            el: this.color_input_vizualization.current,
            theme: 'nano',
            default: options.ob.theme_vals[options.ob.theme].color_input_default,
            useAsButton: true,
            autoReposition: false,
            lockOpacity: !this.alpha_enabled,
            components: {
                palette: true,
                preview: true,
                opacity: this.alpha_enabled,
                hue: true,
                interaction: {
                    hex: true,
                    rgba: true,
                    hsva: true,
                    input: true,
                    save: true,
                },
            },
            strings: {
                save: 'OK',
            },
        });

        this.pickr.on('init', async () => {
            this.pickr.setColorRepresentation('HEXA');

        }).on('show', async () => {
            const hsva = tinycolor(inputs_data.obj[this.family][this.name].color || inputs_data.obj[this.family][this.name].val).toHsv();

            this.pickr.setHSVA(hsva.h, hsva.s * 100, hsva.v * 100, hsva.a, true);

            color_pickiers.focus_input_and_select_all_text_in_it(this.color_pickier_w.current);

        }).on('save', () => {
            color_pickiers.accept_color(this.family, this.name);

        }).on('change', color => {
            if (inputs_data.obj[this.family][this.name].color_pickier_is_visible) {
                color_pickiers.unpack_rgba(color);

                color_pickiers.set_color_input_vizualization_color(this.family, this.name, color_pickiers.mut.current_pickied_color);

                if (!inputs_data.obj[this.family][this.name].changed_color_once_after_focus) {
                    inputs_data.obj[this.family][this.name].changed_color_once_after_focus = true;

                    analytics.send_event('color_pickiers', `changed_color-${this.family}-${this.name}`);
                }
            }
        });
    }

    componentDidUpdate() {
        if (color_pickiers.mut.accepted_by_enter_key) {
            this.pickr.hide();

            color_pickiers.mut.accepted_by_enter_key = false;
        }
    }

    render() {
        // eslint-disable-next-line no-unused-expressions
        inputs_data.obj[this.family][this.name].color_pickier_is_visible;

        const color = inputs_data.obj[this.family][this.name].color || inputs_data.obj[this.family][this.name].val;

        return (
            <React.Fragment>
                <span
                    className={x.cls([
                        'color_input_vizualization',
                        this.type === 'img_selector' ? 'tall_color_input_vizualization' : null,
                    ])}
                    role="button"
                    tabIndex={els_state.com2.inputs_disabled_1}
                    data-family={this.family}
                    data-name={this.name}
                    style={{ backgroundColor: color }}
                    onKeyUp={enter_click.open_color_pickier_on_enter}
                    ref={this.color_input_vizualization}
                />
                <div
                    className="color_pickier_w"
                    ref={this.color_pickier_w}
                />
            </React.Fragment>
        );
    }
}

observer(Color);
observer(Color_input_vizualization);
