import React from 'react';
import { observer } from 'mobx-react';

import * as help_viewer from 'js/help_viewer';
import * as wf_shared from 'js/work_folder/wf_shared';

//--

export const Help = observer(props => {
    const { add_help, family, name } = props;

    return (
        add_help ? (
            <span className="help">
                <button
                    className="help_link"
                    type="button"
                    data-help-message={`${name}_help_message`}
                    data-text="help_link_text"
                    disabled={wf_shared.com2.inputs_disabled_2 && family !== 'settings'}
                    onClick={help_viewer.open_help_viewer.bind(null, family, name)}
                />
            </span>
        )
            : null
    );
});
