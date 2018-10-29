'use strict';

import x from 'x';

import React from 'react';

//--

export const Hr = props => {
    return (
        <div className='hr'>
            <hr></hr><span className='hr_text'>{x.message(props.name + '_hr_text')}</span><hr></hr>
        </div>
    );
};