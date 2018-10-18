'use strict';

import x from 'x';

import plus from 'svg/plus';
import open_in_browser from 'svg/open_in_browser';
import archive from 'svg/archive';
import gear from 'svg/gear';
import question from 'svg/question';
import list from 'svg/list';

import * as open_in_chrome from 'js/open_in_chrome';
import * as toogle_popup from 'js/toogle_popup';

import react from 'react';
import { observer } from "mobx-react";
import Svg from 'svg-inline-react';
const Store = require('electron-store');

const store = new Store();

export class Header extends react.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const chrome_user_data_dirs = open_in_chrome.ob.chrome_user_data_dirs.split(',');
        const chrome_user_data_dirs_final = chrome_user_data_dirs.length == 1 && chrome_user_data_dirs[0] == '' ? [] : chrome_user_data_dirs;

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
                    {
                        chrome_user_data_dirs_final.map((path, i) => {
                            return <Open_in_profiled_chrome_btn
                                key={x.unique_id()}
                                path={path.trim()}
                                no={i + 1}
                            />
                        })
                    }
                    <Open_in_chrome_btn />
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
}

const Open_in_profiled_chrome_btn = props => {
    return (
        <button
            className='header_btn open_in_chrome_btn'
            title={x.message('open_in_chrome_btn_title') + ' - ' + props.path}
            onClick={open_in_chrome.open_in_chrome.bind(null, props.path)}
        >
            {props.no}
        </button>
    );
};

const Open_in_chrome_btn = props => {
    return (
        <button
            className='header_btn header_btn_icon'
            data-title='open_in_chrome_btn_title'
            onClick={open_in_chrome.open_in_chrome.bind(null, '')}
        >
            <Svg src={open_in_browser} />
        </button>
    );
};

const Btn = props => {
    return (
        <button
            className={x.cls(['header_btn header_btn_icon', props.name + '_btn'])}
            data-title={props.name + '_btn_title'}
            onClick={toogle_popup.toggle_popup.bind(null, props.name)}
        >
            <Svg src={props.svg} />
        </button>
    );
};

const Pack_btn = props => {
    return (
        <button
            className='header_btn pack_btn'
            data-title={'pack_as_' + props.name + '_btn_title'}>
            <span className='header_btn_icon pack_btn_icon'>
                <Svg src={archive} />
            </span>
            <label>{props.name.toUpperCase()}</label>
        </button>
    );
};

Header = observer(Header);