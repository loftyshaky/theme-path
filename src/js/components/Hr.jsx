import React from 'react';

import x from 'x';

//--

export const Hr = props => {
    const { name } = props;

    return (
        <div className="hr">
            <hr /><span className="hr_text">{x.message(`${name}_hr_text`)}</span><hr />
        </div>
    );
};
