import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import { on_render } from 'js/init_All';
import * as color_pickiers from 'js/color_pickiers';
import * as toggle_popup from 'js/toggle_popup';
import * as help_viewer from 'js/help_viewer';
import * as tutorial from 'js/tutorial';
import * as mutation_observer from 'js/mutation_observer';
import * as history from 'js/history';
import * as settings from 'js/settings';

import { ErrorBoundary } from 'components/ErrorBoundary';
import { Header } from 'components/Header';
import { Fieldset } from 'components/Fieldset';
import { WorkFolder } from 'components/WorkFolder';
import { InputBlock } from 'components/InputBlock';
import { History } from 'components/History';
import { BulkCopy } from 'components/BulkCopy';
import { Options } from 'components/Options';
import { Help } from 'components/Help';
import { HelpViewer } from 'components/HelpViewer';
import { ProtectingScreen } from 'components/ProtectingScreen';
import { AutoUpdater } from 'components/AutoUpdater';
import { ProcessingMsg } from 'components/ProcessingMsg';
import { ManifestVersion } from 'components/ManifestVersion';

export class All extends React.Component {
    componentDidMount() {
        try {
            on_render();

            settings.set_settings_observable();
            tutorial.apply_alt_style_change_theme_properties_tutorial_item();

            document.addEventListener(
                'mousedown',
                // eslint-disable-next-line max-len
                color_pickiers.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization,
            );
            document.body.addEventListener(
                'keydown',
                color_pickiers.close_or_open_color_pickier_by_keyboard,
            );
            document.body.addEventListener('keydown', toggle_popup.close_all_popups_by_keyboard);
            document.body.addEventListener('keydown', help_viewer.close_help_viewer_by_keyboard);
            window.addEventListener(
                'resize',
                tutorial.apply_alt_style_change_theme_properties_tutorial_item,
            );

            history.set_history_side_popup_width();

            mutation_observer.observer.observe(s('.history_side_popup'), {
                attributes: true,
            });
        } catch (er) {
            err(er, 93);
        }
    }

    componentWillUnmount() {
        try {
            document.removeEventListener(
                'mousedown',
                // eslint-disable-next-line max-len
                color_pickiers.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization,
            );
            document.body.removeEventListener(
                'keydown',
                color_pickiers.close_or_open_color_pickier_by_keyboard,
            );
            document.body.removeEventListener('keydown', toggle_popup.close_all_popups_by_keyboard);
            document.body.removeEventListener('keydown', help_viewer.close_help_viewer_by_keyboard);
            window.removeEventListener(
                'resize',
                tutorial.apply_alt_style_change_theme_properties_tutorial_item,
            );
        } catch (er) {
            err(er, 94);
        }
    }

    render() {
        return (
            <ErrorBoundary>
                <div
                    className='all'
                    onMouseDown={(e) => {
                        if (e.button === 1) {
                            e.preventDefault();
                        }
                    }}
                    role='none'
                >
                    <Header />
                    <div
                        className={x.cls([
                            'fieldsets',
                            settings.ob.settings.wrap_theme_metadata_and_theme_fieldsets
                                ? 'wrap_theme_metadata_and_theme_fieldsets'
                                : '',
                        ])}
                    >
                        <WorkFolder />
                        <span className='theme_metadata_and_theme_fieldset_w'>
                            <Fieldset name='theme_metadata'>
                                <ManifestVersion />
                                <InputBlock name='theme_metadata' />
                            </Fieldset>
                            <Fieldset name='theme'>
                                <InputBlock name='images' hr add_help />
                                <InputBlock name='colors' hr add_help />
                                <InputBlock name='tints' hr add_help />
                                <InputBlock name='properties' hr add_help />
                                <InputBlock name='clear_new_tab' hr add_help />
                            </Fieldset>
                        </span>
                    </div>
                    <ProtectingScreen tr_name='gen' state_key='protecting_screen_is_visible' />
                    <History />
                    <BulkCopy />
                    <Options />
                    <Help />
                    <HelpViewer />
                    <ProcessingMsg />
                    <AutoUpdater />
                </div>
            </ErrorBoundary>
        );
    }
}

observer(All);
