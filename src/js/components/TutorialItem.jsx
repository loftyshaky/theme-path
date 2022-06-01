import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import x from 'x';
import * as analytics from 'js/analytics';
import * as tutorial from 'js/tutorial';
import * as els_state from 'js/els_state';

import { Tr } from 'components/Tr';

import close_svg from 'svg/close.svg';

export class TutorialItem extends React.Component {
    constructor(props) {
        super(props);

        ({
            name: this.name,
            tutorial_stage: this.tutorial_stage,
            outline: this.outline,
        } = this.props);
    }

    skip_tutorial = () => {
        try {
            analytics.add_tutorial_analytics('skipped', tutorial.ob.tutorial_stage);

            tutorial.increment_tutorial_stage(true, false);
        } catch (er) {
            err(er, 172);
        }
    };

    close_tutorial = () => {
        try {
            tutorial.show_or_hide_tutorial_item(false);

            analytics.add_tutorial_analytics('closed', tutorial.ob.tutorial_stage);
        } catch (er) {
            err(er, 173);
        }
    };

    render() {
        const show_tutrial =
            // eslint-disable-next-line eqeqeq
            tutorial.ob.tutorial_stage == this.tutorial_stage &&
            tutorial.ob.tutorial_item_is_visible; // eslint-disable-line eqeqeq

        return (
            <Tr
                attr={{
                    className: x.cls([
                        'tutorial_item',
                        `tutorial_item_${this.name}`,
                        tutorial.ob.alt_style_enabled ? 'alt' : '',
                    ]),
                }}
                tag='div'
                name='gen'
                state={show_tutrial}
            >
                <button
                    className='close_btn tutorial_item_close_btn'
                    type='button'
                    disabled={els_state.com2.inputs_disabled_4}
                    onClick={this.close_tutorial}
                >
                    <Svg src={close_svg} />
                </button>
                <div className='tutorial_text'>{x.msg(`${this.name}_tutorial_item_text`)}</div>
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <button
                    type='button'
                    className='skip_tutorial_btn'
                    data-text='skip_tutorial_btn_text'
                    onClick={this.skip_tutorial}
                />
            </Tr>
        );
    }
}

observer(TutorialItem);
