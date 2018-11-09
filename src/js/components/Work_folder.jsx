import React from 'react';
import { observer } from 'mobx-react';
import * as r from 'ramda';
import Svg from 'svg-inline-react';
import { List, AutoSizer } from 'react-virtualized';

import x from 'x';
import * as shared from 'js/shared';
import * as wf_shared from 'js/work_folder/wf_shared';
import * as component_methods from 'js/work_folder/component_methods';
import * as expand_or_collapse from 'js/work_folder/expand_or_collapse';
import * as select_folder from 'js/work_folder/select_folder';
import * as choose_folder from 'js/work_folder/choose_folder';

import { Fieldset } from 'components/Fieldset';

import folder_svg from 'svg/folder';
import folder_opened_svg from 'svg/folder_opened';
import arrow_right_svg from 'svg/arrow_right';
import arrow_down_svg from 'svg/arrow_down';

//--

export class Work_folder extends React.Component {

    componentDidMount() {
        expand_or_collapse.create_top_level_folders();

        this.select_work_folder_if_its_theme();
    }

    componentDidUpdate() {
        this.select_work_folder_if_its_theme();
    }

    select_work_folder_if_its_theme = () => {
        const work_folder_info = wf_shared.get_info_about_folder(choose_folder.ob.work_folder);

        if (work_folder_info.is_theme) {
            select_folder.select_folder(true, choose_folder.ob.work_folder);
        }
    }

    show_or_hide_choose_work_folder_btn = scroll_info => {
        component_methods.show_or_hide_choose_work_folder_btn(scroll_info);
    };

    render_row = ({ index, key, style }) => {
        const folder = wf_shared.ob.folders[index];
        const folder_is_opened = wf_shared.mut.opened_folders.indexOf(folder.path) > -1;
        const arrow = folder.is_empty || folder.is_theme
            ? <span className="folder_arrow_placeholder" />
            : (
                <button
                    className="folder_arrow"
                    type="button"
                    onClick={expand_or_collapse.expand_or_collapse_folder.bind(null, 'arrow', folder.path, folder.nest_level + 1, index + 1)}
                >
                    <Svg src={folder_is_opened ? arrow_down_svg : arrow_right_svg} />
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
                            onClick={select_folder.select_folder.bind(null, false, folder.path, folder.children, folder.nest_level + 1, index + 1)}
                        >
                            <Svg src={folder_is_opened ? folder_opened_svg : folder_svg} />
                        </button>
                        <button
                            className={x.cls([
                                'folder_name',
                                folder.path === shared.ob.chosen_folder_path ? 'selected_folder' : null,
                            ])}
                            type="button"
                            onClick={select_folder.select_folder.bind(null, false, folder.path, folder.children, folder.nest_level + 1, index + 1)}
                            title={folder.name}
                        >
                            {folder.name}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const number_of_rows = wf_shared.ob.folders.length; // needs to be here, not in rowCount={}, otherwise scroll container wont resize on folder opening
        const message_key = r.ifElse(
            () => choose_folder.ob.work_folder === '',
            () => 'work_folder_is_not_specified_message_text',
            () => {
                const work_folder_info = wf_shared.get_info_about_folder(choose_folder.ob.work_folder);

                if (work_folder_info.is_theme) {
                    return 'work_folder_is_theme_message_text';
                }

                return 'work_folder_is_empty_message_text';
            },
        )();


        const work_folder_is_empty_message = wf_shared.ob.folders.length === 0
            ? (
                <div className="work_folder_message">
                    {
                        x.message(message_key)
                    }
                </div>
            )
            : null;

        return (
            <Fieldset name="work_folder">
                <div className={x.cls([
                    'work_folder_selector',
                    component_methods.ob.show_work_folder_selector ? '' : 'none',
                ])}
                >
                    <button
                        className="btn choose_work_folder_btn"
                        type="button"
                        data-text="choose_folder_btn_text"
                        onClick={choose_folder.choose_folder.bind(
                            null,
                            expand_or_collapse.create_top_level_folders,
                        )}
                    />
                    <button
                        className={x.cls([
                            'work_folder_path',
                            shared.ob.chosen_folder_path === choose_folder.ob.work_folder ? 'selected_folder'
                                : null,
                        ])}
                        type="button"
                        title={choose_folder.ob.work_folder}
                        onClick={component_methods.select_root_folder}
                    >
                        {choose_folder.ob.work_folder}
                    </button>
                </div>
                {work_folder_is_empty_message}
                <AutoSizer>
                    {({ width, height }) => (
                        <List
                            width={width}
                            height={height}
                            rowHeight={32}
                            rowRenderer={this.render_row}
                            rowCount={number_of_rows}
                            tabIndex={null}
                            onScroll={this.show_or_hide_choose_work_folder_btn}
                            style={{
                                padding: '60px 12px 12px 8px',
                                boxSizing: 'border-box',
                                overflow: 'auto!important',
                            }}
                        />
                    )}
                </AutoSizer>
            </Fieldset>
        );
    }
}

observer(Work_folder);
