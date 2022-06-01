import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import x from 'x';
import * as help_viewer from 'js/help_viewer';

import { Tr } from 'components/Tr';

import close_svg from 'svg/close.svg';

export const HelpViewer = observer(() => {
    const help_viewer_name = help_viewer.ob.help_viewer_name ? (
        <div className='help_viewer_name'>{help_viewer.ob.help_viewer_name}</div>
    ) : null;

    const help_viewer_img = help_viewer.ob.help_viewer_img ? (
        <img className='help_viewer_img' src={help_viewer.ob.help_viewer_img} alt='HelpBtn' />
    ) : null;

    return (
        <>
            <Tr
                attr={{
                    className: 'help_viewer_w',
                }}
                tag='div'
                name='gen'
                state={help_viewer.ob.help_viewer_is_visible}
                tr_end_callbacks={[() => help_viewer.none_help_viewer(false)]}
            >
                <div
                    className={x.cls([
                        'help_viewer',
                        help_viewer.ob.help_viewer_is_none ? 'none' : '',
                    ])}
                    role='presentation'
                    onClick={help_viewer.on_help_viewer_click}
                    onContextMenu={help_viewer.close_help_viewer_by_right_click_when_img_collapsed}
                >
                    <button className='close_btn' type='button'>
                        <Svg src={close_svg} />
                    </button>
                    <div className='help_viewer_inner_w'>
                        {help_viewer_name}
                        <p className='help_viewer_message'>{help_viewer.ob.help_viewer_message}</p>
                        {help_viewer_img}
                    </div>
                </div>
            </Tr>
            <Tr
                attr={{
                    className: 'help_viewer_expanded_img_w',
                }}
                tag='div'
                name='gen'
                state={help_viewer.ob.help_viewer_expanded_img_is_visible}
            >
                <div
                    className='help_viewer_expanded_img'
                    role='presentation'
                    style={{ backgroundImage: `url('${help_viewer.ob.help_viewer_img}')` }}
                    onClick={help_viewer.on_help_viewer_click}
                    onContextMenu={help_viewer.deactivate_all}
                />
            </Tr>
        </>
    );
});
