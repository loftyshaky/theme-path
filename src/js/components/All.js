'use strict';

import x from 'x';

import { Header } from 'components/Header';
import { Fieldset } from 'components/Fieldset';
import { Work_folder } from 'components/Work_folder';
import { Hr } from 'components/Hr';
import { Textarea } from 'components/Textarea';
import { Img_selector } from 'components/Img_selector';
import { Color } from 'components/Color';
import { Select } from 'components/Select';
import { Settings } from 'components/Settings';
import { Links } from 'components/Links';
import { Protecting_screen } from 'components/Protecting_screen';

import react from 'react';

export class All extends react.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='all'>
                <Header />
                <Work_folder />
                <Fieldset name="theme_metadata">
                    <Textarea name='version' />
                    <Select
                        name='locale'
                        add_help
                    />
                    <Textarea name='name' />
                    <Textarea name='description' />
                    <Select
                        name='default_locale'
                        add_help
                    />
                </Fieldset>
                <Fieldset name="theme">
                    <Hr name='images' />
                    <Img_selector
                        name="theme_ntp_background"
                        input_type='images'
                    />
                    <Img_selector
                        name="theme_toolbar"
                        input_type='images'
                    />
                    <Img_selector
                        name="theme_frame"
                        input_type='images'
                    />
                    <Img_selector
                        name="theme_frame_inactive"
                        input_type='images'
                    />
                    <Img_selector
                        name="theme_frame_incognito"
                        input_type='images'
                    />
                    <Img_selector
                        name="theme_frame_incognito_inactive"
                        input_type='images'
                    />
                    <Img_selector
                        name="theme_frame_overlay"
                        input_type='images'
                    />
                    <Img_selector
                        name="theme_tab_background"
                        input_type='images'
                    />
                    <Img_selector
                        name="theme_tab_background_incognito"
                        input_type='images'
                    />
                    <Img_selector
                        name="theme_window_control_background"
                        input_type='images'
                    />
                    <Img_selector
                        name="theme_ntp_attribution"
                        input_type='images'
                    />
                    <Hr name='colors' />
                    <Color
                        name='ntp_background'
                        type='color'
                        input_type='colors'
                    />
                    <Color
                        name='toolbar'
                        type='color'
                        input_type='colors'
                    />
                    <Color
                        name='frame'
                        type='color'
                        input_type='colors'
                    />
                    <Color
                        name='frame_inactive'
                        type='color'
                        input_type='colors'
                    />
                    <Color
                        name='frame_incognito'
                        type='color'
                        input_type='colors'
                    />
                    <Color
                        name='frame_incognito_inactive'
                        type='color'
                        input_type='colors'
                    />
                    <Color
                        name='bookmark_text'
                        type='color'
                        input_type='colors'
                    />
                    <Color
                        name='tab_text'
                        type='color'
                        input_type='colors'
                    />
                    <Color
                        name='tab_background_text'
                        type='color'
                        input_type='colors'
                    />
                    <Color
                        name='button_background'
                        type='color'
                        input_type='colors'
                    />
                    <Select
                        name='ntp_text'
                        input_type='colors'
                        add_help
                    />
                    <Hr name='tints' />
                    <Color
                        name='frame'
                        type='color'
                        input_type='tints'
                    />
                    <Color
                        name='frame_inactive'
                        type='color'
                        input_type='tints'
                    />
                    <Color
                        name='frame_incognito'
                        type='color'
                        input_type='tints'
                    />
                    <Color
                        name='frame_incognito_inactive'
                        type='color'
                        input_type='tints'
                    />
                    <Color
                        name='background_tab'
                        type='color'
                        input_type='tints'
                    />
                    <Color
                        name='buttons'
                        type='color'
                        input_type='tints'
                    />
                    <Hr name='properties' />
                    <Select
                        name='ntp_background_alignment'
                        input_type='properties'
                        add_help
                    />
                    <Select
                        name='ntp_background_repeat'
                        input_type='properties'
                        add_help
                    />
                    <Select
                        name='ntp_logo_alternate'
                        input_type='properties'
                        add_help
                    />
                </Fieldset>
                <Protecting_screen />
                <Settings />
                <Links />
            </div>
        );
    }
}