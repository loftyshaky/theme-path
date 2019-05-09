import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import x from 'x';
import * as analytics from 'js/analytics';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as els_state from 'js/els_state';
import * as folders from 'js/work_folder/folders';
import * as expand_or_collapse from 'js/work_folder/expand_or_collapse';
import * as new_theme_or_rename from 'js/work_folder/new_theme_or_rename';
import * as open_and_pack from 'js/open_and_pack';
import * as toggle_popup from 'js/toggle_popup';
import * as show_or_open_folder from 'js/show_or_open_folder';
import * as choose_folder from 'js/work_folder/choose_folder';
import * as search from 'js/work_folder/search';

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

    expand_or_collapse_folder = async () => {
        try {
            const root_folder_chosen = chosen_folder_path.ob.chosen_folder_path === choose_folder.ob.work_folder;

            if (root_folder_chosen) {
                new_theme_or_rename.create_new_theme_or_rename_theme_folder(
                    'creating_folder',
                    chosen_folder_path.ob.chosen_folder_path,
                    0,
                    0,
                    true,
                );

            } else {
                expand_or_collapse.expand_or_collapse_folder(
                    'new_theme',
                    chosen_folder_path.ob.chosen_folder_path,
                    folders.mut.chosen_folder_info.nest_level,
                    folders.mut.chosen_folder_info.i_to_insert_folder_in,
                );
            }

        } catch (er) {
            err(er, 98);
        }
    };

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

    render() {
        const chrome_user_data_dirs = open_and_pack.ob.chrome_user_data_dirs.split(',');
        const chrome_user_data_dirs_final = chrome_user_data_dirs.length === 1 && chrome_user_data_dirs[0] === ''
            ? []
            : chrome_user_data_dirs;

        return (
            <header>
                <span className="header_section header_left">
                    <div className="btn_w">
                        <button
                            className="header_btn new_theme_btn"
                            type="button"
                            onClick={this.expand_or_collapse_folder}
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
                        chrome_user_data_dirs_final.map((folder_path, i) => (
                            <Open_in_profiled_chrome_btn
                                key={x.unique_id()}
                                path={folder_path.trim()}
                                no={i + 1}
                            />
                        ))
                    }
                    <div className="btn_w">
                        <Btn
                            name="open_in_chrome"
                            on_click={e => open_and_pack.open_in_chrome('', true, e)}
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
                        on_click={show_or_open_folder.show_folder}
                        svg={arrow_up_2_svg}
                    />
                    <Btn
                        name="open_folder"
                        on_click={show_or_open_folder.open_folder}
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
    const { path, no } = props;

    return (
        <button
            className="header_btn open_in_chrome_btn"
            type="button"
            title={`${x.msg('open_in_chrome_btn_title')} - ${path}`}
            disabled={els_state.com2.inputs_disabled_5}
            onMouseUp={open_and_pack.open_in_chrome.bind(null, path, false)}
            onKeyUp={open_and_pack.open_in_chrome.bind(null, path, false)}
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
