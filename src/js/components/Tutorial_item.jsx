import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import x from 'x';
import * as analytics from 'js/analytics';
import * as tutorial from 'js/tutorial';
import * as wf_shared from 'js/work_folder/wf_shared';

import { Tr } from 'components/Tr';

import close_svg from 'svg/close';

//--

export class Tutorial_item extends React.Component {
    componentDidMount() {
        this.apply_alt_style_if_tutorial_item_out_of_screen();
    }

    componentDidUpdate() {
        this.apply_alt_style_if_tutorial_item_out_of_screen();
    }

    apply_alt_style_if_tutorial_item_out_of_screen = async () => {
        try {
            await x.delay(0);

            const { name, tutorial_stage } = this.props;

            if (tutorial.ob.tutorial_stage == tutorial_stage && !tutorial.ob.alt_style_enabled) { // eslint-disable-line eqeqeq
                const rect = s(`.tutorial_item_${name}`).getBoundingClientRect();
                const tutorial_item_is_in_viewport = rect.left >= 0 && rect.right <= window.innerWidth;

                if (!tutorial_item_is_in_viewport) {
                    tutorial.enable_or_disable_alt_style(true);

                    tutorial.mut.recursive_apply_alt_style_if_tutorial_item_out_of_screen_already_called = false;

                } else {
                    tutorial.enable_or_disable_alt_style(false);

                    await x.delay(1000);

                    if (!tutorial.mut.recursive_apply_alt_style_if_tutorial_item_out_of_screen_already_called) {
                        tutorial.mut.recursive_apply_alt_style_if_tutorial_item_out_of_screen_already_called = true;

                        this.apply_alt_style_if_tutorial_item_out_of_screen();
                    }
                }
            }

        } catch (er) {
            err(er, 157);
        }
    }

    skip_tutorial = () => {
        try {
            analytics.add_tutorial_analytics('skipped', tutorial.ob.tutorial_stage);

            tutorial.increment_tutorial_stage(true, false);

        } catch (er) {
            err(er, 172);
        }
    }

    close_tutorial = () => {
        try {

            tutorial.show_or_hide_tutorial_item(false);

            analytics.add_tutorial_analytics('closed', tutorial.ob.tutorial_stage);

        } catch (er) {
            err(er, 173);
        }
    }

    render() {
        const { name, tutorial_stage, outline } = this.props;
        const show_tutrial = tutorial.ob.tutorial_stage == tutorial_stage && tutorial.ob.tutorial_item_is_visible; // eslint-disable-line eqeqeq

        const outline_el = outline
            ? (
                <Tr
                    attr={{
                        className: x.cls(['tutorial_outline', `tutorial_outline_${name}`]),
                    }}
                    tag="span"
                    name="tutorial_outline"
                    state={show_tutrial}
                />
            ) : null;

        return (
            <React.Fragment>
                <Tr
                    attr={{
                        className: x.cls(['tutorial_item', `tutorial_item_${name}`, tutorial.ob.alt_style_enabled ? 'alt' : '']),
                    }}
                    tag="div"
                    name="gen"
                    state={show_tutrial}
                >
                    <button
                        className="close_btn tutorial_item_close_btn"
                        type="button"
                        disabled={wf_shared.com2.inputs_disabled_4}
                        onClick={this.close_tutorial}
                    >
                        <Svg src={close_svg} />
                    </button>
                    <div className="tutorial_text">
                        {x.msg(`${name}_tutorial_item_text`)}
                    </div>
                    <button
                        type="button"
                        className="skip_tutorial_btn"
                        data-text="skip_tutorial_btn_text"
                        onClick={this.skip_tutorial}
                    />
                </Tr>
                {outline_el}
            </React.Fragment>
        );
    }
}

observer(Tutorial_item);
