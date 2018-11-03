import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';
import Store from 'electron-store';

import x from 'x';
import * as shared from 'js/shared';
import * as wf_shared from 'js/work_folder/wf_shared';
import * as expand_or_collapse from 'js/work_folder/expand_or_collapse';
import * as new_theme_or_rename from 'js/work_folder/new_theme_or_rename';
import * as open_and_pack from 'js/open_and_pack';
import * as toogle_popup from 'js/toogle_popup';

import plus_svg from 'svg/plus';
import open_in_browser_svg from 'svg/open_in_browser';
import archive_svg from 'svg/archive';
import gear_svg from 'svg/gear';
import question_svg from 'svg/question';
import list_svg from 'svg/list';

const store = new Store();

//--

export class Header extends React.Component {
    expand_or_collapse_folder = async () => {
        try {
            const root_folder_chosen = shared.ob.chosen_folder_path === store.get('work_folder');

            if (root_folder_chosen) {
                new_theme_or_rename.create_new_theme_or_rename_theme_folder(shared.ob.chosen_folder_path, 0, 0, true);

            } else {
                expand_or_collapse.expand_or_collapse_folder(
                    'new_theme',
                    shared.ob.chosen_folder_path,
                    wf_shared.mut.chosen_folder_info.nest_level,
                    wf_shared.mut.chosen_folder_info.i_to_insert_folfder_in,
                );
            }

        } catch (er) {
            err(er, 98);
        }
    };

    render() {
        const chrome_user_data_dirs = open_and_pack.ob.chrome_user_data_dirs.split(',');
        const chrome_user_data_dirs_final = chrome_user_data_dirs.length === 1 && chrome_user_data_dirs[0] === ''
            ? []
            : chrome_user_data_dirs;

        return (
            <header>
                <span className="header_section header_left">
                    <button
                        className="header_btn new_theme_btn"
                        type="button"
                        onClick={this.expand_or_collapse_folder}
                    >
                        <span className="header_btn_icon new_theme_btn_icon">
                            <Svg src={plus_svg} />
                        </span>
                        <label data-text="new_theme_btn_label_text" />
                    </button>
                    <span className="current_theme_name">
                        {shared.ob.default_locale_theme_name}
                    </span>
                </span>
                <span className="header_section header_right">
                    {
                        chrome_user_data_dirs_final.map((folder_path, i) => (
                            <Open_in_profiled_chrome_btn
                                key={x.unique_id()}
                                path={folder_path.trim()}
                                no={i + 1}
                            />
                        ))
                    }
                    <Open_in_chrome_btn />
                    <Pack_btn name="zip" />
                    <Pack_btn name="crx" />
                    <Btn
                        name="settings"
                        svg={gear_svg}
                    />

                    <Btn
                        name="help"
                        svg={question_svg}
                    />

                    <Btn
                        name="links"
                        svg={list_svg}
                    />
                </span>
            </header>
        );
    }
}

const Open_in_profiled_chrome_btn = props => {
    const { path, no } = props;

    return (
        <button
            className="header_btn open_in_chrome_btn"
            type="button"
            title={`${x.message('open_in_chrome_btn_title')} - ${path}`}
            onClick={open_and_pack.open_in_chrome.bind(null, path)}
        >
            {no}
        </button>
    );
};

const Open_in_chrome_btn = () => (
    <button
        className="header_btn header_btn_icon"
        type="button"
        data-title="open_in_chrome_btn_title"
        onClick={open_and_pack.open_in_chrome.bind(null, '')}
    >
        <Svg src={open_in_browser_svg} />
    </button>
);

const Btn = props => {
    const { name, svg } = props;

    return (
        <button
            className={x.cls(['header_btn header_btn_icon', `${name}_btn`])}
            type="button"
            data-title={`${name}_btn_title`}
            onClick={toogle_popup.toggle_popup.bind(null, name)}
        >
            <Svg src={svg} />
        </button>
    );
};

const Pack_btn = props => {
    const { name } = props;

    return (
        <button
            className="header_btn pack_btn"
            type="button"
            data-title={`pack_as_${name}_btn_title`}
            onClick={open_and_pack.pack.bind(null, name)}
        >
            <span className="header_btn_icon pack_btn_icon">
                <Svg src={archive_svg} />
            </span>
            <label>{name.toUpperCase()}</label>
        </button>
    );
};

observer(Header);
