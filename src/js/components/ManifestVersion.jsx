import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import { inputs_data } from 'js/inputs_data';

export class ManifestVersion extends React.Component {
    render() {
        return (
            <div className='manifest_version'>
                {`${x.msg('manifest_version_label_text')}: ${inputs_data.manifest_version}`}
            </div>
        );
    }
}

observer(ManifestVersion);
