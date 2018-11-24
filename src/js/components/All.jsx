import React from 'react';

import * as color_pickiers from 'js/color_pickiers';
import * as tab_focus from 'js/tab_focus';
import * as toogle_popup from 'js/toogle_popup';

import { Error_boundary } from 'components/Error_boundary';
import { Header } from 'components/Header';
import { Fieldset } from 'components/Fieldset';
import { Work_folder } from 'components/Work_folder';
import { Input_block } from 'components/Input_block';
import { Settings } from 'components/Settings';
import { Links } from 'components/Links';
import { Help_viewer } from 'components/Help_viewer';
import { Protecting_screen } from 'components/Protecting_screen';

//--

export class All extends React.Component {
    componentDidMount() {
        try {
            document.addEventListener('mousedown', color_pickiers.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization);
            document.body.addEventListener('mousedown', tab_focus.set_using_mouse_cls.bind(null, 'add_cls'));
            document.body.addEventListener('keydown', tab_focus.prevent_el_focus_on_esc);
            document.body.addEventListener('keydown', tab_focus.set_using_mouse_cls.bind(null, 'remove_cls'));
            document.body.addEventListener('keydown', color_pickiers.close_or_open_color_pickier_by_keyboard);
            document.body.addEventListener('keydown', toogle_popup.close_all_popups_by_keyboard);

        } catch (er) {
            err(er, 93);
        }
    }

    componentWillUnmount() {
        try {
            document.removeEventListener('mousedown', color_pickiers.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization);
            document.body.removeEventListener('mousedown', tab_focus.set_using_mouse_cls.bind(null, 'add_cls'));
            document.body.removeEventListener('keydown', tab_focus.prevent_el_focus_on_esc);
            document.body.removeEventListener('keydown', tab_focus.set_using_mouse_cls.bind(null, 'remove_cls'));
            document.body.removeEventListener('keydown', color_pickiers.close_or_open_color_pickier_by_keyboard);
            document.body.removeEventListener('keydown', toogle_popup.close_all_popups_by_keyboard);

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
                    </div>
                    <Protecting_screen />
                    <Settings />
                    <Links />
                    <Help_viewer />
                </div>
            </Error_boundary>
        );
    }
}
