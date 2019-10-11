import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import * as help_viewer from 'js/help_viewer';
import * as els_state from 'js/els_state';

export const Help_btn = observer(props => {
    const { add_help, family, name } = props;
    const { val: show_help } = inputs_data.obj.options.show_help;

    return (
        <React.Fragment>
            {add_help
                ? (
                    <span className={x.cls(['help', show_help ? null : 'none'])}>
                        <button
                            className="help_link"
                            type="button"
                            data-help-message={`${name}_help_message`}
                            data-text="help_link_text"
                            disabled={els_state.com2.inputs_disabled_2 && family !== 'options'}
                            onClick={help_viewer.open_help_viewer.bind(null, family, name)}
                        />
                    </span>
                )
                : null
            }
            {
                add_help && !show_help
                    ? <div className="help_padder" />
                    : null
            }

        </React.Fragment>
    );
});
