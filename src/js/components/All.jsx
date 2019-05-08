import React from 'react';

import * as color_pickiers from 'js/color_pickiers';
import * as toggle_popup from 'js/toggle_popup';
import * as help_viewer from 'js/help_viewer';
import * as tutorial from 'js/tutorial';

import { Error_boundary } from 'components/Error_boundary';
import { Header } from 'components/Header';
import { Fieldset } from 'components/Fieldset';
import { Work_folder } from 'components/Work_folder';
import { Input_block } from 'components/Input_block';
import { Options } from 'components/Options';
import { Links } from 'components/Links';
import { Help_viewer } from 'components/Help_viewer';
import { Protecting_screen } from 'components/Protecting_screen';
import { Tutorial_item } from 'components/Tutorial_item';
import { Auto_updater } from 'components/Auto_updater';
import { Analytics_privacy } from 'components/Analytics_privacy';

//--

export class All extends React.Component {
    componentDidMount() {
        try {
            document.addEventListener('mousedown', color_pickiers.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization);
            document.body.addEventListener('keydown', color_pickiers.close_or_open_color_pickier_by_keyboard);
            document.body.addEventListener('keydown', toggle_popup.close_all_popups_by_keyboard);
            document.body.addEventListener('keydown', help_viewer.close_help_viewer_by_keyboard);
            window.addEventListener('resize', tutorial.rerender_Tutorial_item);

        } catch (er) {
            err(er, 93);
        }
    }

    componentWillUnmount() {
        try {
            document.removeEventListener('mousedown', color_pickiers.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization);
            document.body.removeEventListener('keydown', color_pickiers.close_or_open_color_pickier_by_keyboard);
            document.body.removeEventListener('keydown', toggle_popup.close_all_popups_by_keyboard);
            document.body.removeEventListener('keydown', help_viewer.close_help_viewer_by_keyboard);
            window.removeEventListener('resize', tutorial.rerender_Tutorial_item);

        } catch (er) {
            err(er, 94);
        }
    }

    render() {
        return (
            <Error_boundary>
                <div className="all">
                    <Header />
                    <div className="fieldsets">
                        <Work_folder />
                        <span className="theme_metadata_and_theme_fieldset_w">
                            <Fieldset name="theme_metadata">
                                <Input_block name="theme_metadata" />
                            </Fieldset>
                            <Fieldset name="theme">
                                <Input_block
                                    name="images"
                                    hr
                                    add_help
                                />
                                <Input_block
                                    name="colors"
                                    hr
                                    add_help
                                />
                                <Input_block
                                    name="tints"
                                    hr
                                    add_help
                                />
                                <Input_block
                                    name="properties"
                                    hr
                                    add_help
                                />
                            </Fieldset>
                            <Tutorial_item
                                name="change_theme_properties"
                                tutorial_stage="5"
                                outline
                            />
                        </span>
                    </div>
                    <Protecting_screen tr_name="gen" state_key="protecting_screen_is_visible" />
                    <Protecting_screen tr_name="analytics_privacy_protecting_screen" state_key="analytics_privacy_is_visible" />
                    <Options />
                    <Links />
                    <Help_viewer />
                    <Auto_updater />
                    <Analytics_privacy />
                </div>
            </Error_boundary>
        );
    }
}
