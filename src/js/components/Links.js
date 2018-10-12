'use strict';

import x from 'x';

import { Popup } from 'components/Popup';

import react from 'react';

export const Links = props => {
    return (
        <Popup name='links'>
            <div>
                <Link name='clear_new_tab' />
                <Link
                    name='deviant_art_group'
                    href='https://bit.ly/deviant-art-group'
                />
                <Link
                    name='donate'
                    href='https://bit.ly/donate-loftyshaky'
                />
            </div>
        </Popup>
    );
}

const Link = props => {
    return (
        <a
            className={x.cls(['bottom_link', props.name + '_link'])}
            href={props.href}
            target="_blank"
            data-text={props.name + '_link_text'}
            data-href={!props.href ? props.name + '_link_href' : null}
        ></a>
    );
}