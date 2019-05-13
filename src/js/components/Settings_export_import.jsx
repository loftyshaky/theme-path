import React from 'react';

import * as settings_export_import from 'js/settings_export_import';

export const Settings_export_import = () => (
    <div className="input">
        <button
            className="btn export_settings_btn"
            type="button"
            data-text="export_settings_btn_text"
            onClick={settings_export_import.export_settings}
        />
        <button
            className="btn import_settings_btn"
            type="button"
            data-text="import_settings_btn_text"
            onClick={settings_export_import.import_settings}
        />
    </div>
);
