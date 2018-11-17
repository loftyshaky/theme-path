import React from 'react';

import * as help_viewer from 'js/help_viewer';

//--

export const Help = props => {
    const { add_help, family, name } = props;

    return (
        add_help ? (
            <span className="help">
                <button
                    className="help_link"
                    type="button"
                    data-help-message={`${name}_help_message`}
                    data-text="help_link_text"
                    onClick={help_viewer.open_help_viewer.bind(null, family, name)}
                />
            </span>
        )
            : null
    );
};
