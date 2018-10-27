'use strict';

import react from 'react';

export const Help = props => {
    return (
        props.add_help ?
            <span className='help'>
                <a
                    className='help_link'
                    data-help-message={props.name + '_help_message'}
                    data-text='help_link_text'
                    href='#'
                ></a>
                <span className='help_message'
                    data-text={props.name + '_help_message_text'}
                ></span>
            </span>
            : null
    );
};