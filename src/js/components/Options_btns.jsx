import React from 'react';

import * as settings_export_import from 'js/settings_export_import';
import * as history from 'js/history';

export const Options_btns = () => (
    <div className='input'>
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
            className='btn export_settings_btn'
            type='button'
            data-text='export_settings_btn_text'
            onClick={settings_export_import.export_settings}
        />
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
            className='btn import_settings_btn'
            type='button'
            data-text='import_settings_btn_text'
            onClick={settings_export_import.import_settings}
        />
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
            className='btn delete_all_history_btn'
            type='button'
            data-text='delete_all_history_btn_text'
            onClick={history.delete_all_history}
        />
    </div>
);
