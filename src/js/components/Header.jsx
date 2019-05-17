import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import x from 'x';
import * as analytics from 'js/analytics';
import * as els_state from 'js/els_state';
import * as folders from 'js/work_folder/folders';
import * as open_and_pack from 'js/open_and_pack';
import * as toggle_popup from 'js/toggle_popup';
import * as show_or_open_folder from 'js/show_or_open_folder';
import * as custom_paths_btns from 'js/custom_paths_btns';
import * as search from 'js/work_folder/search';
import * as expand_or_collapse from 'js/work_folder/expand_or_collapse';
import * as custom_folders from 'js/work_folder/custom_folders';

import { Tutorial_item } from 'components/Tutorial_item';

import plus_svg from 'svg/plus';
import dehaze_svg from 'svg/dehaze';
import arrow_up_2_svg from 'svg/arrow_up_2';
import eye_svg from 'svg/eye';
import open_in_browser_svg from 'svg/open_in_browser';
import archive_svg from 'svg/archive';
import gear_svg from 'svg/gear';
import list_svg from 'svg/list';

export class Header extends React.Component {
    constructor(props) {
        super(props);

        this.entered_one_char_in_search_input_after_focus = false;
    }

    on_input_in_search_input = () => {
        try {
            search.trigger_work_folder_reload();

            if (!this.entered_one_char_in_search_input_after_focus) {
                this.entered_one_char_in_search_input_after_focus = true;

                analytics.send_event('header_items', 'input-search_input');
            }

        } catch (er) {
            err(er, 164);
        }
    }

    on_blur_search_input = () => {
        try {
            this.entered_one_char_in_search_input_after_focus = false;

        } catch (er) {
            err(er, 168);
        }
    }

    create_new_theme = () => {
        analytics.add_header_btns_analytics('new_theme');

        expand_or_collapse.create_new_theme_or_folder(null);
    }

    render() {
        const chrome_exe_paths = custom_paths_btns.create_paths_arr(open_and_pack.ob.chrome_exe_paths);
        const chrome_user_data_folders = custom_paths_btns.create_paths_arr(open_and_pack.ob.chrome_user_data_folders);
        const custom_folders_var = custom_paths_btns.create_paths_arr(custom_folders.ob.custom_folders);

        return (
            <header>
                <span className="header_section header_left">
                    <div className="btn_w">
                        <button
                            className="header_btn new_theme_btn"
                            type="button"
                            onClick={this.create_new_theme}
                            disabled={els_state.com2.inputs_disabled_5}
                        >
                            <span className="header_btn_icon new_theme_btn_icon">
                                <Svg src={plus_svg} />
                            </span>
                            <label data-text="new_theme_btn_label_text" />
                        </button>
                        <Tutorial_item
                            name="create_new_theme"
                            tutorial_stage="3"
                            outline={false}
                        />
                    </div>
                    {
                        custom_folders_var.map((folder_path, i) => (
                            <Create_custom_folder_btn
                                key={x.unique_id()}
                                path={folder_path.trim()}
                                no={i + 1}
                            />
                        ))
                    }
                    <input
                        className="search_input"
                        type="text"
                        data-placeholder="search_input_placeholder"
                        disabled={els_state.com2.inputs_disabled_5}
                        onInput={this.on_input_in_search_input}
                        onBlur={this.on_blur_search_input}
                    />
                </span>
                <span className="header_section header_right">
                    {
                        chrome_user_data_folders.map((folder_path, i) => (
                            <Open_in_profiled_chrome_btn
                                key={x.unique_id()}
                                exe={chrome_exe_paths[i] ? chrome_exe_paths[i] : chrome_exe_paths[0]}
                                path={folder_path}
                                no={i + 1}
                            />
                        ))
                    }
                    <div className="btn_w">
                        <Btn
                            name="open_in_chrome"
                            on_click={e => open_and_pack.open_in_chrome(null, null, e)}
                            svg={open_in_browser_svg}
                        />
                        <Tutorial_item
                            name="open_in_chrome"
                            tutorial_stage="6"
                            outline={false}
                        />
                    </div>
                    <Btn
                        name="collapse_all_folders"
                        on_click={folders.collapse_all_folders}
                        svg={dehaze_svg}
                    />
                    <Btn
                        name="show_folder"
                        on_click={() => show_or_open_folder.show_or_open_folder('show')}
                        svg={arrow_up_2_svg}
                    />
                    <Btn
                        name="open_folder"
                        on_click={() => show_or_open_folder.show_or_open_folder('open')}
                        svg={eye_svg}
                    />
                    <div className="btn_w">
                        <Pack_btn name="zip" />
                        <Pack_btn name="crx" />
                        <Tutorial_item
                            name="pack"
                            tutorial_stage="7"
                            outline={false}
                        />
                    </div>
                    <Popup_btn
                        name="options"
                        svg={gear_svg}
                    />

                    <Popup_btn
                        name="links"
                        svg={list_svg}
                    />
                </span>
            </header>
        );
    }
}

const Open_in_profiled_chrome_btn = props => {
    const { exe, path, no } = props;

    return (
        <button
            className="header_btn open_in_chrome_btn"
            type="button"
            title={`${x.msg('open_in_chrome_btn_title')} - ${path}`}
            disabled={els_state.com2.inputs_disabled_5}
            onMouseUp={open_and_pack.open_in_chrome.bind(null, exe, path)}
            onKeyUp={open_and_pack.open_in_chrome.bind(null, exe, path)}
        >
            {no}
        </button>
    );
};

const Create_custom_folder_btn = props => {
    const { path, no } = props;

    const create_custom_folder = () => {
        analytics.add_header_btns_analytics('create_custom_folder');

        expand_or_collapse.create_new_theme_or_folder(path);
    };

    return (
        <button
            className="header_btn open_in_chrome_btn"
            type="button"
            title={`${x.msg('create_custom_folder_btn_title')} - ${path}`}
            disabled={els_state.com2.inputs_disabled_5}
            onClick={create_custom_folder}
        >
            {no}
        </button>
    );
};

const Btn = props => {
    const { name, on_click, svg } = props;

    const on_click_inner = e => {
        try {
            on_click(e);

            if (name !== 'open_in_chrome') {
                analytics.add_header_btns_analytics(name);
            }

        } catch (er) {
            err(er, 165);
        }
    };


    return (
        <button
            className="header_btn header_btn_icon"
            type="button"
            data-title={`${name}_btn_title`}
            disabled={els_state.com2.inputs_disabled_5}
            {...(name === 'open_in_chrome' ? { onMouseUp: on_click_inner, onKeyUp: on_click_inner } : { onClick: on_click_inner })}
        >
            <Svg src={svg} />
        </button>
    );
};

const Popup_btn = props => {
    const { name, svg } = props;

    const on_click = () => {
        try {
            toggle_popup.toggle_popup(name);

            analytics.add_header_btns_analytics(name);

        } catch (er) {
            err(er, 166);
        }
    };

    return (
        <button
            className={x.cls(['header_btn header_btn_icon', `${name}_btn`])}
            type="button"
            data-title={`${name}_btn_title`}
            disabled={els_state.com2.inputs_disabled_5}
            onClick={on_click}
        >
            <Svg src={svg} />
        </button>
    );
};

const Pack_btn = props => {
    const { name } = props;

    const on_click = () => {
        try {
            open_and_pack.pack(name);

            analytics.add_header_btns_analytics(name);

        } catch (er) {
            err(er, 167);
        }
    };

    return (
        <button
            className="header_btn pack_btn"
            type="button"
            data-title={`pack_as_${name}_btn_title`}
            disabled={els_state.com2.inputs_disabled_5}
            onClick={on_click}
        >
            <span className="header_btn_icon pack_btn_icon">
                <Svg src={archive_svg} />
            </span>
            <label>{name.toUpperCase()}</label>
        </button>
    );
};

observer(Header);
