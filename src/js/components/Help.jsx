import React from 'react';

//--

export const Help = props => {
    const { add_help, name } = props;

    return (
        add_help ? (
            <span className="help">
                <button
                    className="help_link"
                    type="button"
                    data-help-message={`${name}_help_message`}
                    data-text="help_link_text"
                />
                <span
                    className="help_message"
                    data-text={`${name}_help_message_text`}
                />

            </span>
        )
            : null
    );
};
