'use strict';

import x from 'x';

import * as settings_popup from 'js/settings_popup';

import { Header } from 'components/Header';
import { Fieldset } from 'components/Fieldset';
import { Work_folder } from 'components/Work_folder';
import { Input_block } from 'components/Input_block';
import { Settings } from 'components/Settings';
import { Links } from 'components/Links';
import { Protecting_screen } from 'components/Protecting_screen';

import react from 'react';

export class All extends react.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.addEventListener('mousedown', settings_popup.show_or_hide_settings_popup);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', settings_popup.show_or_hide_settings_popup);
    }

    render() {
        return (
            <div className='all'>
                <Header />
                <div className='fieldsets'>
                    <Work_folder />
                    <Fieldset name='theme_metadata'>
                        <Input_block name='theme_metadata' />
                    </Fieldset>
                    <Fieldset name='theme'>
                        <Input_block
                            name='images'
                            hr
                        />
                        <Input_block
                            name='colors'
                            hr
                        />
                        <Input_block
                            name='tints'
                            hr
                        />
                        <Input_block
                            name='properties'
                            hr
                        />
                    </Fieldset>
                </div>
                <Protecting_screen />
                <Settings />
                <Links />
            </div>
        );
    }
}