import React from 'react';

import x from 'x';

export const Btn = props => {
    const { name, on_click } = props;

    return (
        <button
            type="button"
            className="btn"
            onClick={on_click}
        >
            {x.msg(`${name}_btn_text`)}
        </button>
    );
};
