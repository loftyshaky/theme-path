import React from 'react';

import { inputs_data } from 'js/inputs_data';

import { Hr } from 'components/Hr';
import { Textarea } from 'components/Textarea';
import { Select } from 'components/Select';
import { Img_selector } from 'components/Img_selector';
import { Color } from 'components/Color';
import { Checkbox } from 'components/Checkbox';
import { Help } from 'components/Help';

//--

export class Input_block extends React.Component {
    constructor(props) {
        super(props);

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
        const { name, hr } = this.props;
        const hr_el = hr ? <Hr name={name} /> : null;

        return (
            <React.Fragment>
                <div className="hr_and_help">
                    {hr_el}
                    <Help {...this.props} />
                </div>
                <div className={name === 'colors' || name === 'tints' ? 'colors_and_tints_input_block' : null}>
                    {
                        inputs_data.obj[name].map((item, i) => {
                            const Component = sta.components[item.type];
                            const color_input_type = item.type === 'color' ? 'color' : null;

                            return (
                                <Component
                                    {...item}
                                    i={i}
                                    color_input_type={color_input_type}
                                    add_help={item.add_help}
                                    ref={instance => { this.childs.push(this.child = instance); }}
                                    count_char={this.count_char}
                                />
                            );
                        })
                    }
                </div>
            </React.Fragment>
        );
    }
}

//> varibles
const sta = {
    components: {
        textarea: Textarea,
        select: Select,
        img_selector: Img_selector,
        color: Color,
        checkbox: Checkbox,
    },
};
//< varibles
