import React from 'react';

import x from 'x';
import * as analytics from 'js/analytics';

import { Popup } from 'components/Popup';
import { Hr } from 'components/Hr';
import { Help_item } from 'components/Help_item';

export const Help = () => (
    <Popup name="help">
        <ul className="help_block">
            <Help_item
                name="delete_all_history"
                important
            />
            <Help_item name="preview" />
            <Help_item name="reupload_img" />
            <Help_item name="bulk_select" />
            <Help_item name="bulk_copy" />
            <Help_item name="bulk_pack" />
        </ul>
        <Hr name="links" />
        <div className="help_block links_block">
            <Link
                name="privacy_policy"
                href="https://bit.ly/ctc-privacy-policy"
            />
            <Link // eslint-disable-line jsx-a11y/anchor-is-valid
                name="clear_new_tab"
            />
            <Link
                name="facebook_page"
                href="https://bit.ly/browservery"
            />
            <Link
                name="donate"
                href="https://bit.ly/donate-loftyshaky"
            />
        </div>
        <div className="app_version">{`v${app_version}`}</div>
    </Popup>
);

const Link = props => {
    const { name, href } = props;

    return (
        <a
            className={x.cls(['bottom_link', `${name}_link`])}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            data-text={`${name}_link_text`}
            data-href={!href ? `${name}_link_href` : null}
            onClick={analytics.send_event.bind(null, 'help', `clicked-${name}`)}
        />
    );
};
