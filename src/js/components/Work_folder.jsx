import React from 'react';
import { observer } from 'mobx-react';
import * as r from 'ramda';
import Svg from 'svg-inline-react';
import { List, AutoSizer } from 'react-virtualized';

import x from 'x';
import * as analytics from 'js/analytics';
import * as chosen_folder_path from 'js/chosen_folder_path';
import * as els_state from 'js/els_state';
import * as folders from 'js/work_folder/folders';
import * as component_methods from 'js/work_folder/component_methods';
import * as expand_or_collapse from 'js/work_folder/expand_or_collapse';
import * as select_folder from 'js/work_folder/select_folder';
import * as choose_folder from 'js/work_folder/choose_folder';
import * as search from 'js/work_folder/search';

import { Fieldset } from 'components/Fieldset';
import { Tutorial_item } from 'components/Tutorial_item';

import folder_svg from 'svg/folder';
import folder_open_svg from 'svg/folder_open';
import keyboard_arrow_right_svg from 'svg/keyboard_arrow_right';
import keyboard_arrow_down_svg from 'svg/keyboard_arrow_down';

export class Work_folder extends React.Component {
    constructor(props) {
        super(props);

        this.set_ref = this.set_ref.bind(this);
    }

    async componentDidMount() {
        expand_or_collapse.create_top_level_folders();

        this.select_work_folder_if_its_theme();

        x.as_first(s('.ReactVirtualized__List'), this.work_folder_selector_w);
    }

    componentDidUpdate() {
        this.select_work_folder_if_its_theme();
    }

    set_ref(work_folder_selector_w) {
        this.work_folder_selector_w = work_folder_selector_w;
    }

    select_work_folder_if_its_theme = () => {
        const work_folder_info = folders.get_info_about_folder(choose_folder.ob.work_folder);

        if (work_folder_info.is_theme) {
            select_folder.select_folder(true, choose_folder.ob.work_folder);
        }
    }

    render_row = ({ index, key, style }) => {
        const folder = search.mut.filtered_folders[index];
        const folder_is_opened = folders.mut.opened_folders.indexOf(folder.path) > -1;
        const folder_is_selected = folder.path === chosen_folder_path.ob.chosen_folder_path;
        const folder_is_bulk_selected = chosen_folder_path.check_if_folder_is_bulk_selected(folder.path);
        const select_folder_f = select_folder.select_folder.bind(null, false, folder.path, folder.children, folder.nest_level + 1);

        const on_click_folder_arrow = () => {
            expand_or_collapse.expand_or_collapse_folder('arrow', folder.path, folder.nest_level + 1);

            if (!folder_is_opened) {
                analytics.add_work_folder_analytics('expanded_folder');

            } else {
                analytics.add_work_folder_analytics('collapsed_folder');
            }
        };

        const arrow = folder.is_empty || folder.is_theme
            ? <span className="folder_arrow_placeholder" />
            : (
                <button
                    className="folder_arrow"
                    type="button"
                    disabled={els_state.com2.inputs_disabled_4}
                    onClick={on_click_folder_arrow}
                >
                    <Svg src={folder_is_opened ? keyboard_arrow_down_svg : keyboard_arrow_right_svg} />
                </button>
            );

        return (
            <div
                className="folder_w"
                key={key}
                style={style}
            >
                <div
                    className="folder"
                    style={{ marginLeft: `${folder.nest_level}0px` }}
                >
                    {arrow}
                    <div className="folder_inner">
                        <button
                            className={x.cls(['folder_icon', folder.is_theme ? 'folder_icon_theme' : ''])}
                            type="button"
                            tabIndex="-1"
                            onClick={select_folder_f}
                            onAuxClick={select_folder_f}
                        >
                            <Svg src={folder_is_opened ? folder_open_svg : folder_svg} />
                        </button>
                        <button
                            className={x.cls([
                                'folder_name',
                                folder_is_selected ? 'selected_folder' : '',
                                folder_is_bulk_selected ? 'selected_folder_bulk' : '',
                                folder_is_selected && folder_is_bulk_selected ? 'selected_folder_bulk_over' : '',
                            ])}
                            type="button"
                            title={folder.name}
                            tabIndex={els_state.com2.inputs_disabled_3}
                            onClick={select_folder_f}
                            onAuxClick={select_folder_f}
                            onKeyUp={select_folder_f}
                        >
                            {folder.name}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        search.search();

        const number_of_rows = search.mut.filtered_folders.length; // needs to be here, not in rowCount={}, otherwise scroll container wont resize on folder opening
        folders.ob.folders; chosen_folder_path.ob.chosen_folder_path; els_state.com2.inputs_disabled_4; chosen_folder_path.ob.chosen_folder_bulk_paths.slice(); // eslint-disable-line no-unused-expressions

        return (
            <Fieldset name="work_folder">
                <Work_folder_selector set_ref={this.set_ref} />
                <AutoSizer>
                    {({ width, height }) => (
                        <List
                            width={width}
                            height={height}
                            rowHeight={32}
                            rowRenderer={this.render_row}
                            rowCount={number_of_rows}
                            tabIndex={null}
                            style={{
                                padding: '22px 12px 12px 8px',
                                boxSizing: 'border-box',
                                overflow: 'auto!important',
                            }}
                        />
                    )}
                </AutoSizer>
                <Tutorial_item
                    name="select_folder"
                    tutorial_stage="2"
                />
                <Tutorial_item
                    name="select_theme"
                    tutorial_stage="4"
                />
            </Fieldset>
        );
    }
}

class Work_folder_selector extends React.Component {
    render() {
        folders.ob.folders; // eslint-disable-line no-unused-expressions

        const { set_ref } = this.props;
        const work_folder_is_selected = choose_folder.ob.work_folder === chosen_folder_path.ob.chosen_folder_path;
        const work_folder_is_bulk_selected = chosen_folder_path.check_if_folder_is_bulk_selected(choose_folder.ob.work_folder);

        const message_key = r.ifElse(
            () => choose_folder.ob.work_folder === '',
            () => 'work_folder_is_not_specified_message_text',
            () => {
                const work_folder_info = folders.get_info_about_folder(choose_folder.ob.work_folder);

                if (work_folder_info.is_theme) {
                    return 'work_folder_is_theme_message_text';
                }

                return 'work_folder_is_empty_message_text';
            },
        )();

        const work_folder_is_empty_message = search.mut.filtered_folders.length === 0
            ? (
                <div className="work_folder_message">
                    {
                        x.msg(message_key)
                    }
                </div>
            )
            : null;

        return (
            <div
                className="work_folder_selector_w"
                ref={set_ref}
            >
                <div className="work_folder_selector">
                    <div className="btn_w">
                        <button
                            className="btn choose_work_folder_btn"
                            type="button"
                            data-text="choose_folder_btn_text"
                            disabled={els_state.com2.inputs_disabled_4}
                            onClick={choose_folder.choose_folder.bind(
                                null,
                                expand_or_collapse.create_top_level_folders,
                            )}
                        />
                        <Tutorial_item
                            name="choose_folder"
                            tutorial_stage="1"
                        />
                    </div>
                    <button
                        className={x.cls([
                            'work_folder_path',
                            work_folder_is_selected ? 'selected_folder' : '',
                            work_folder_is_bulk_selected ? 'selected_folder_bulk' : '',
                            work_folder_is_selected && work_folder_is_bulk_selected ? 'selected_folder_bulk_over' : '',
                        ])}
                        type="button"
                        tabIndex={els_state.com2.inputs_disabled_3}
                        title={choose_folder.ob.work_folder}
                        onClick={component_methods.select_work_folder}
                        onAuxClick={component_methods.select_work_folder}
                        onKeyUp={component_methods.select_work_folder}
                    >
                        {choose_folder.ob.work_folder}
                    </button>
                </div>
                {work_folder_is_empty_message}
            </div>
        );
    }
}

observer(Work_folder);
observer(Work_folder_selector);
