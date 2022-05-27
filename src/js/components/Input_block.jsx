import React from "react";

import x from "x";
import { inputs_data } from "js/inputs_data";
import * as conds from "js/conds";

import { Hr } from "components/Hr";
import { Textarea } from "components/Textarea";
import { Select } from "components/Select";
import { Img_selector } from "components/Img_selector";
import { Color } from "components/Color";
import { Checkbox } from "components/Checkbox";
import { Tint } from "components/Tint";
import { Options_btns } from "components/Options_btns";
import { Help_btn } from "components/Help_btn";

export class Input_block extends React.Component {
  constructor(props) {
    super(props);

    ({ name: this.name, hr: this.hr } = this.props);

    this.hr_el = this.hr ? <Hr name={this.name} /> : null;

    this.childs = [];
    this.set_childs = false;
  }

  componentDidMount() {
    this.set_childs = true;
  }

  //> call count_char method from </Textarea> instance when you change default locale in </Select>
  count_char = () => {
    try {
      this.childs.forEach((child) => {
        if (child.count_char) {
          child.count_char();
        }
      });
    } catch (er) {
      err(er, 103);
    }
  };
  //< call count_char method from </Textarea> instance when you change default locale in </Select>

  render() {
    return (
      <React.Fragment>
        <div
          className={x.cls([
            "hr_and_help",
            conds.colors(this.name) ? "colors_and_tints_hr_and_help" : null,
          ])}
        >
          {this.hr_el}
          <Help_btn {...this.props} />
        </div>
        <div
          className={
            this.name === "colors" || this.name === "tints"
              ? "colors_and_tints_input_block"
              : null
          }
        >
          {Object.values(inputs_data.obj[this.name]).map((item) => {
            const Component = con.components[item.type];
            const is_class_component =
              Component.prototype && Component.prototype.render;

            return (
              <Component
                {...item}
                count_char={this.count_char}
                checkbox_type={item.type === "checkbox" ? "options" : null}
                ref={
                  !is_class_component ||
                  this.set_childs ||
                  item.name === "options_btns"
                    ? null
                    : (instance) => {
                        if (instance) this.childs.push((this.child = instance));
                      }
                }
              />
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}

const con = {
  components: {
    textarea: Textarea,
    select: Select,
    img_selector: Img_selector,
    color: Color,
    checkbox: Checkbox,
    tint: Tint,
    options_btns: Options_btns,
  },
};
