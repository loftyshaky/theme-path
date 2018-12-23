import React from 'react';

import x from 'x';

import { Popup } from 'components/Popup';

//--

export const Links = () => (
    <Popup name="links">
        <div>
            <Link // eslint-disable-line jsx-a11y/anchor-is-valid
                name="clear_new_tab"
            />
            <Link
                name="facebook_page"
                href="https://bit.ly/simpleext"
            />
            <Link
                name="donate"
                href="https://bit.ly/donate-loftyshaky"
            />
        </div>
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
        >
            content
        </a>
    );
};
