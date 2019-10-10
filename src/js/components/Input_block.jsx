import React from 'react';

import { inputs_data } from 'js/inputs_data';

import { Hr } from 'components/Hr';
import { Textarea } from 'components/Textarea';
import { Select } from 'components/Select';
import { Img_selector } from 'components/Img_selector';
import { Color } from 'components/Color';
import { Checkbox } from 'components/Checkbox';
import { Settings_export_import } from 'components/Settings_export_import';
import { Help } from 'components/Help';

export class Input_block extends React.Component {
    constructor(props) {
        super(props);

        ({
            name: this.name,
            hr: this.hr,
        } = this.props);

        this.hr_el = this.hr ? <Hr name={this.name} /> : null;

        this.childs = [];
    }

    //> call count_char method from </Textarea> instance when you change default locale in </Select>
    count_char = () => {
        try {
            this.childs.forEach(child => {
                if (child.count_char) {
                    child.count_char();
                }
            });

        } catch (er) {
            err(er, 103);
        }
    }
    //< call count_char method from </Textarea> instance when you change default locale in </Select>

    render() {
        return (
            <React.Fragment>
                <div className="hr_and_help">
                    {this.hr_el}
                    <Help {...this.props} />
                </div>
                <div className={this.name === 'colors' || this.name === 'tints' ? 'colors_and_tints_input_block' : null}>
                    {
                        Object.values(inputs_data.obj[this.name]).map(item => {
                            const Component = sta.components[item.type];

                            return (
                                <Component
                                    {...item}
                                    count_char={this.count_char}
                                    checkbox_type={item.type === 'checlbox' ? 'options' : null}
                                    ref={item.name === 'settings_export_import' ? null : instance => { this.childs.push(this.child = instance); }}
                                />
                            );
                        })
                    }
                </div>
            </React.Fragment>
        );
    }
}

const sta = {
    components: {
        textarea: Textarea,
        select: Select,
        img_selector: Img_selector,
        color: Color,
        checkbox: Checkbox,
        settings_export_import: Settings_export_import,
    },
};
