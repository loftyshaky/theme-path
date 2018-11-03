import React from 'react';

import * as color_pickiers from 'js/color_pickiers';

import { Header } from 'components/Header';
import { Fieldset } from 'components/Fieldset';
import { Work_folder } from 'components/Work_folder';
import { Input_block } from 'components/Input_block';
import { Settings } from 'components/Settings';
import { Links } from 'components/Links';
import { Protecting_screen } from 'components/Protecting_screen';

//--

export class All extends React.Component {
    componentDidMount() {
        try {
            document.addEventListener(
                'mousedown',
                color_pickiers.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization,
            );

        } catch (er) {
            err(er, 93);
        }
    }

    componentWillUnmount() {
        try {
            document.removeEventListener(
                'mousedown',
                color_pickiers.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization,
            );

        } catch (er) {
            err(er, 94);
        }
    }

    render() {
        return (
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
                        />
                        <Input_block
                            name="colors"
                            hr
                        />
                        <Input_block
                            name="tints"
                            hr
                        />
                        <Input_block
                            name="properties"
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
