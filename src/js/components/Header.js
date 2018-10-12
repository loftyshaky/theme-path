'use strict';

import x from 'x';

import plus from 'svg/plus';
import archive from 'svg/archive';
import gear from 'svg/gear';
import question from 'svg/question';
import list from 'svg/list';

import react from 'react';
import Svg from 'svg-inline-react';

export const Header = props => {
    return (
        <header>
            <span className='header_section header_left'>
                <button className='header_btn new_theme_btn'>
                    <span className='header_btn_icon new_theme_btn_icon'>
                        <Svg src={plus} />
                    </span>
                    <label data-text='new_theme_btn_label_text'>
                    </label>
                </button>
                <span className='current_theme_name'>Theme Name
                </span>
            </span>
            <span className='header_section header_right'>
                <Open_in_chrome_btn no='1' />
                <Open_in_chrome_btn no='2' />
                <Open_in_chrome_btn no='3' />
                <Pack_btn name='zip' />
                <Pack_btn name='crx' />
                <Btn
                    name='settings'
                    svg={gear}
                >
                </Btn>
                <Btn
                    name='help'
                    svg={question}
                >
                </Btn>
                <Btn
                    name='links'
                    svg={list}
                >
                </Btn>
            </span>
        </header >
    );
}

const Open_in_chrome_btn = props => {
    return (
        <button className='header_btn open_in_chrome_btn' data-title='open_in_chrome_btn_title'>
            {props.no}
        </button>
    );
};

const Btn = props => {
    return (
        <button
            className={x.cls(['header_btn header_btn_icon', props.name + '_btn'])}
            data-title={props.name + '_btn_title'}
        >
            <Svg src={props.svg} />
        </button>
    );
};

const Pack_btn = props => {
    return (
        <button className='header_btn pack_btn' data-title={'pack_as_' + props.name + '_btn_title'}>
            <span className='header_btn_icon pack_btn_icon'>
                <Svg src={archive} />
            </span>
            <label>{props.name.toUpperCase()}</label>
        </button>
    );
};