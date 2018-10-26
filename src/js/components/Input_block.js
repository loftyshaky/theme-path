'use strict';


import { inputs_data } from 'js/inputs_data';

import { Hr } from 'components/Hr';
import { Textarea } from 'components/Textarea';
import { Select } from 'components/Select';
import { Img_selector } from 'components/Img_selector';
import { Color } from 'components/Color';

import react from 'react';

export class Input_block extends react.Component {
    constructor(props) {
        super(props);

        this.childs = [];
    }

    //> call count_char method from </Textarea> instance when you change default locale in </Select>
    count_char = () => {
        for (const child of this.childs) {
            if (child.count_char) {
                child.count_char();
            }
        }
    }
    //< call count_char method from </Textarea> instance when you change default locale in </Select>

    render() {
        const hr = this.props.hr ? <Hr name={this.props.name} /> : null;

        return (
            <react.Fragment>
                {hr}
                <div className={this.props.name == 'colors' || this.props.name == 'tints' ? 'colors_and_tints_input_block' : null}>
                    {
                        inputs_data.obj[this.props.name].map((item, i) => {
                            const Component = sta.components[item.type];
                            const color_input_type = item.type == 'color' ? 'color' : null;

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
            </react.Fragment>
        );
    }
}

//> varibles t
const sta = {
    components: {
        textarea: Textarea,
        select: Select,
        img_selector: Img_selector,
        color: Color
    }
}
//< varibles t