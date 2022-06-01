import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as els_state from 'js/els_state';

import { Tr } from 'components/Tr';
import { HistoryFieldsetProtectingScreen } from 'components/ProtectingScreen';
import { TutorialItem } from 'components/TutorialItem';

export const Fieldset = observer((props) => {
    const { name, children } = props;

    const fieldset_protecting_screen =
        name === 'work_folder' ? null : (
            <Tr
                attr={{
                    className: 'fieldset_protecting_screen',
                }}
                tag='div'
                name='gen'
                state={els_state.com.fieldset_protecting_screen_is_visible}
            />
        );

    return (
        <div className={x.cls(['fieldset_w', `${name}_fieldset_w`])}>
            <Tr
                attr={{
                    className: `${name}_fieldset`,
                }}
                tag='fieldset'
                name='fieldset'
                state={els_state.com.fieldset_protecting_screen_is_visible}
            >
                <Tr
                    attr={{
                        className: 'legend',
                    }}
                    tag='div'
                    name='legend'
                    state={els_state.com.fieldset_protecting_screen_is_visible}
                >
                    {x.msg(`${name}_legend_text`)}
                    <div className='legend_line' />
                </Tr>
                <div className='cover' />
                <div className='fieldset_content_w'>
                    <div className='fieldset_content'>
                        <div className='history_fieldset_protecting_screen_w'>
                            <HistoryFieldsetProtectingScreen name={name} />
                            {children}
                        </div>
                    </div>
                    {fieldset_protecting_screen}
                </div>
                {name === 'theme_metadata' ? (
                    <TutorialItem name='change_theme_properties' tutorial_stage='5' />
                ) : null}
            </Tr>
        </div>
    );
});
