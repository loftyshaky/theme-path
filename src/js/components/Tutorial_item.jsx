import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import x from 'x';
import * as tutorial from 'js/tutorial';
import * as wf_shared from 'js/work_folder/wf_shared';

import { Tr } from 'components/Tr';

import close_svg from 'svg/close';

//--

export const Tutorial_item = observer(props => {
    const { name, tutorial_stage, outline } = props;
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
                    className: x.cls(['tutorial_item', `tutorial_item_${name}`]),
                }}
                tag="div"
                name="gen"
                state={show_tutrial}
            >
                <button
                    className="close_btn tutorial_item_close_btn"
                    type="button"
                    disabled={wf_shared.com2.inputs_disabled_5}
                    onClick={tutorial.show_or_hide_tutorial_item.bind(null, false)}
                >
                    <Svg src={close_svg} />
                </button>
                <div className="tutorial_text">
                    {x.message(`${name}_tutorial_item_text`)}
                </div>
            </Tr>
            {outline_el}
        </React.Fragment>
    );
});
