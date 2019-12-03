import * as r from 'ramda';
import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import x from 'x';
import * as analytics from 'js/analytics';
import * as els_state from 'js/els_state';
import * as folders from 'js/work_folder/folders';
import * as open_and_pack from 'js/open_and_pack';
import * as show_or_open_folder from 'js/show_or_open_folder';
import * as custom_paths_btns from 'js/custom_paths_btns';
import * as history from 'js/history';
import * as bulk_copy from 'js/bulk_copy';
import * as imgs from 'js/imgs';
import * as reupload_img from 'js/reupload_img';
import * as enter_click from 'js/enter_click';
import * as header from 'js/header';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as search from 'js/work_folder/search';
import * as expand_or_collapse from 'js/work_folder/expand_or_collapse';
import * as custom_folders from 'js/work_folder/custom_folders';

import { Tutorial_item } from 'components/Tutorial_item';
import { History_fieldset_protecting_screen } from 'components/Protecting_screen';

import add_svg from 'svg/add';
import dehaze_svg from 'svg/dehaze';
import arrow_upward_svg from 'svg/arrow_upward';
import visibility_svg from 'svg/visibility';
import open_in_browser_svg from 'svg/open_in_browser';
import archive_svg from 'svg/archive';
import settings_applications_svg from 'svg/settings_applications';
import help_svg from 'svg/help';
import history_svg from 'svg/history';
import layers_clear_svg from 'svg/layers_clear';
import upload_svg from 'svg/upload';
import queue_svg from 'svg/queue';
import delete_svg from 'svg/delete';

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
                        <Btn
                            name="new_theme"
                            label_text={x.msg('new_theme_btn_label_text')}
                            svg={add_svg}
                            f={this.create_new_theme}
                        />
                        <Tutorial_item
                            name="create_new_theme"
                            tutorial_stage="3"
                            outline={false}
                        />
                    </div>
                    {
                        custom_folders_var.map((folder_path, i) => (
                            <Btn
                                key={x.unique_id()}
                                name="open_folder"
                                title={`${x.msg('create_custom_folder_btn_title')} - ${folder_path}`}
                                no={i + 1}
                                f={() => header.create_custom_folder(folder_path)}
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
                        chrome_user_data_folders.map((folder_path, i) => {
                            const exe = chrome_exe_paths[i] ? chrome_exe_paths[i] : chrome_exe_paths[0];

                            return (
                                <Btn
                                    key={x.unique_id()}
                                    name="open_folder"
                                    btn_is_inactive_class={els_state.try_to_set_btn_is_inactive_class()}
                                    title={`${x.msg('open_in_chrome_btn_title')} - ${folder_path}`}
                                    attach_action_to_on_key_up_too
                                    add_auxclick_e
                                    no={i + 1}
                                    f={e => open_and_pack.open_in_chrome(exe, folder_path, e)}
                                />
                            );
                        })
                    }
                    <div className="btn_w">
                        <Btn
                            name="open_in_chrome"
                            btn_is_inactive_class={els_state.try_to_set_btn_is_inactive_class()}
                            attach_action_to_on_key_up_too
                            add_auxclick_e
                            svg={open_in_browser_svg}
                            f={e => open_and_pack.open_in_chrome(null, null, e)}
                        />
                        <Tutorial_item
                            name="open_in_chrome"
                            tutorial_stage="6"
                            outline={false}
                        />
                    </div>
                    <Btn
                        name="history"
                        btn_is_inactive_class={els_state.try_to_set_btn_is_inactive_class()}
                        svg={history_svg}
                        f={history.load_history}
                    />
                    <Btn
                        name="bulk_copy"
                        btn_is_inactive_class={els_state.try_to_set_btn_is_inactive_class()}
                        label_text={chosen_folder_path.ob.bulk_theme_count}
                        svg={queue_svg}
                        f={() => bulk_copy.show_or_hide_bulk_copy(true)}
                    />
                    <Btn
                        name="deselect_all_bulk_folders"
                        btn_is_inactive_class={els_state.try_to_set_btn_is_inactive_class()}
                        svg={layers_clear_svg}
                        f={chosen_folder_path.deselect_all_bulk_folders}
                    />
                    <Btn
                        name="collapse_all_folders"
                        btn_is_inactive_class={els_state.try_to_set_btn_is_inactive_class()}
                        svg={dehaze_svg}
                        f={folders.collapse_all_folders}
                    />
                    <Btn
                        name="show_folder"
                        svg={arrow_upward_svg}
                        f={() => show_or_open_folder.show_or_open_folder('show')}
                    />
                    <Btn
                        name="open_folder"
                        svg={visibility_svg}
                        f={() => show_or_open_folder.show_or_open_folder('open')}
                    />
                    <Btn
                        name="reupload_img"
                        btn_is_inactive_class={els_state.try_to_set_btn_is_inactive_class()}
                        title={`${x.msg('reupload_img_btn_title')}${reupload_img.ob.previous_img_path ? ` - ${reupload_img.ob.previous_img_path}` : ''}`}
                        svg={upload_svg}
                        f={() => imgs.handle_files('reupload')}
                    />
                    <Btn
                        name="move_to_trash"
                        svg={delete_svg}
                        f={() => folders.move_to_trash()}
                    />
                    <div className="btn_w">
                        <Btn
                            name="pack_as_zip"
                            label_text="ZIP"
                            btn_is_inactive_class
                            custom_action
                            svg={archive_svg}
                            f={() => header.pack('zip')}
                        />
                        <Btn
                            name="pack_as_crx"
                            label_text="CRX"
                            btn_is_inactive_class
                            custom_action
                            svg={archive_svg}
                            f={() => header.pack('crx')}
                        />
                        <Tutorial_item
                            name="pack"
                            tutorial_stage="7"
                            outline={false}
                        />
                    </div>
                    <Btn
                        name="options"
                        svg={settings_applications_svg}
                        custom_action
                        f={() => header.toggle_popup_f('options')}
                    />
                    <Btn
                        name="help"
                        custom_action
                        svg={help_svg}
                        f={() => header.toggle_popup_f('help')}
                    />
                </span>
                <History_fieldset_protecting_screen />
            </header>
        );
    }
}


const Btn = props => {
    const { name, btn_is_inactive_class, label_text, title, no, svg, custom_action, attach_action_to_on_key_up_too, add_auxclick_e, f } = props;
    let btn_content = <Svg src={svg} />;

    if (!r.isNil(label_text)) {
        btn_content = (
            <React.Fragment>
                <span>
                    <Svg src={svg} />
                </span>
                <label>{label_text}</label>
            </React.Fragment>
        );

    } else if (no) {
        btn_content = no;
    }

    const action = e => {
        try {
            f(e);
            analytics.add_header_btns_analytics(name);

        } catch (er) {
            err(er, 165);
        }
    };

    const click_f = custom_action ? f : action;
    let on_key_up = enter_click.simulate_mouse_up_on_enter;

    if (attach_action_to_on_key_up_too) {
        on_key_up = custom_action ? f : action;
    }

    return (
        <button
            className={x.cls([
                'header_btn',
                'header_btn_icon',
                !r.isNil(label_text) ? 'label_btn' : null,
                no ? 'numered_btn' : null,
                `${name}_btn`,
                btn_is_inactive_class ? els_state.try_to_set_btn_is_inactive_class() : null,
            ])}
            type="button"
            title={title || x.msg(`${name}_btn_title`)}
            disabled={els_state.com2.inputs_disabled_5}
            onClick={click_f}
            onAuxClick={add_auxclick_e ? click_f : null}
            onKeyUp={on_key_up}
        >
            {btn_content}
        </button>
    );
};

observer(Header);
observer(Btn);
