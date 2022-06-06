import React from 'react';

import x from 'x';

import { Popup } from 'components/Popup';
import { Hr } from 'components/Hr';
import { HelpItem } from 'components/HelpItem';

export const Help = () => (
    <Popup name='help'>
        <ul className='help_block'>
            <HelpItem name='delete_all_history' important />
            <HelpItem name='preview' />
            <HelpItem name='reupload_img' />
            <HelpItem name='bulk_select' />
            <HelpItem name='bulk_copy' />
            <HelpItem name='bulk_pack' />
            <HelpItem name='change_sub_vals_in_color_picker' />
            <HelpItem name='copy_color_val_in_color_picker' />
            <HelpItem name='paste_color_val_in_color_picker' />
        </ul>
        <Hr name='links' />
        <div className='help_block links_block'>
            <Link name='privacy_policy' href='https://bit.ly/ctc-privacy-policy' />
            <Link // eslint-disable-line jsx-a11y/anchor-is-valid
                name='clear_new_tab'
            />
            <Link name='facebook_page' href='https://bit.ly/browservery' />
            <Link name='donate' href='https://bit.ly/donate-loftyshaky' />
        </div>
        <div className='app_version'>{`v${app_version}`}</div>
    </Popup>
);

const Link = (props) => {
    const { name, href } = props;

    return (
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        <a
            className={x.cls(['bottom_link', `${name}_link`])}
            aria-label='Link'
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            data-text={`${name}_link_text`}
            data-href={href ? null : `${name}_link_href`}
        />
    );
};
