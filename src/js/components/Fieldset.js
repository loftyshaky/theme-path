'use strict';

import x from 'x';

import react from 'react';

export const Fieldset = props => {
    return (
        <div className={x.cls(['fieldset_w', props.name + '_fieldset_w'])}>
            <div className='legend'>
                {x.message(props.name + '_legend_text')}
                <div className='legend_line'></div>
            </div>
            <div className='cover'></div>
            <fieldset className={props.name + '_fieldset'}>
                <div>
                    {props.children}
                </div>
            </fieldset>
        </div>
    );
}