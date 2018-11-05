import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as wf_shared from 'js/work_folder/wf_shared';

import { Tr } from 'components/Tr';

//--

export const Fieldset = observer(props => {
    const { name, children } = props;

    const fieldset_protecting_screen = name !== 'work_folder' ? (
        <Tr
            attr={{
                className: 'fieldset_protecting_screen',
            }}
            tag="div"
            name="gen"
            state={wf_shared.com.fieldset_protecting_screen_is_visible}
        />
    )
        : null;


    return (
        <div className={x.cls(['fieldset_w', `${name}_fieldset_w`])}>
            <Tr
                attr={{
                    className: 'legend',
                }}
                tag="div"
                name="legend"
                state={wf_shared.com.fieldset_protecting_screen_is_visible}
            >
                {x.message(`${name}_legend_text`)}
                <div className="legend_line" />
            </Tr>
            <div className="cover" />
            <Tr
                attr={{
                    className: `${name}_fieldset`,
                }}
                tag="fieldset"
                name="fieldset"
                state={wf_shared.com.fieldset_protecting_screen_is_visible}
            >
                <div>
                    {children}
                    {fieldset_protecting_screen}
                </div>
            </Tr>
        </div>
    );
});
