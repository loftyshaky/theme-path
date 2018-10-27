'use strict';

import x from 'x';
import * as wf_shared from 'js/work_folder/wf_shared';
import { Tr } from 'js/Tr';

import react from 'react';
import { observer } from "mobx-react";

export let Fieldset = props => {
    const fieldset_protecting_screen = props.name !== 'work_folder' ?
        <Tr
            attr={{
                className: 'fieldset_protecting_screen'
            }}
            tag='div'
            name='gen'
            state={wf_shared.ob.fieldset_protecting_screen_is_visible}
        ></Tr>
        :
        null;


    return (
        <div className={x.cls(['fieldset_w', props.name + '_fieldset_w'])}>
            <Tr
                attr={{
                    className: 'legend'
                }}
                tag='div'
                name='legend'
                state={wf_shared.ob.fieldset_protecting_screen_is_visible}
            >
                {x.message(props.name + '_legend_text')}
                <div className='legend_line'></div>
            </Tr>
            <div className='cover'></div>
            <Tr
                attr={{
                    className: props.name + '_fieldset'
                }}
                tag='fieldset'
                name='fieldset'
                state={wf_shared.ob.fieldset_protecting_screen_is_visible}
            >
                <div>
                    {props.children}
                    {fieldset_protecting_screen}
                </div>
            </Tr>
        </div>
    );
}

Fieldset = observer(Fieldset);