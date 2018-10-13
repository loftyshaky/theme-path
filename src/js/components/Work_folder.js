'use strict';

import x from 'x';

import * as work_folder from 'js/work_folder';
import * as choose_folder from 'js/choose_folder';
import { Fieldset } from 'components/Fieldset';
import folder_svg from 'svg/folder';
import folder_opened_svg from 'svg/folder_opened';
import arrow_right_svg from 'svg/arrow_right';
import arrow_down_svg from 'svg/arrow_down';

import react from 'react';
import { observer } from "mobx-react";
import Svg from 'svg-inline-react';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from "react-virtualized";
const Store = require('electron-store');

const store = new Store();

export class Work_folder extends react.Component {
    constructor(props) {
        super(props);

        this.list = react.createRef();
    }

    componentDidMount() {
        window.addEventListener('load', () => {
            this.rerender_list();
        });

        window.addEventListener('resize', () => {
            this.rerender_list();
        });
    }

    componentDidUpdate() {
        this.rerender_list();
    }

    expand_folder = async args => {
        work_folder.expand_folder(...args);

        this.rerender_list();
    };

    show_or_hide_choose_work_folder_btn = scroll_info => {
        work_folder.show_or_hide_choose_work_folder_btn(scroll_info);
    };

    render_row = ({ index, key, style, parent }) => {
        const folder = work_folder.ob.folders[index];
        const folder_is_opened = work_folder.mut.opened_folders.indexOf(folder.path) > - 1;
        const arrow = folder.is_empty || folder.is_theme ?
            <span className='folder_arrow_placeholder'></span>
            :
            <span
                className='folder_arrow'
                onClick={this.expand_folder.bind(null, [folder.path, folder.children, folder.nest_level + 1, index + 1])}
            ><Svg src={folder_is_opened ? arrow_down_svg : arrow_right_svg} /> </span>;

        return (
            <CellMeasurer
                key={key}
                cache={this.cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}
            >
                <div
                    className='folder_w'
                    style={style}
                >
                    <div
                        className='folder'
                        style={{ marginLeft: folder.nest_level + '0px' }}
                    >
                        {arrow}
                        <span
                            className={x.cls(['folder_icon', folder.is_theme ? 'folder_icon_theme' : ''])}
                            onClick={work_folder.select_folder.bind(null, folder.path, folder.children)}
                        >
                            <Svg src={folder_is_opened ? folder_opened_svg : folder_svg} />
                        </span>
                        <span
                            className={x.cls(['folder_name', folder.path == work_folder.ob.chosen_folder_path ? 'selected_folder' : null])}
                            onClick={work_folder.select_folder.bind(null, folder.path, folder.children)}
                        >
                            {folder.name}
                        </span>
                    </div>
                </div>
            </CellMeasurer>
        );
    };

    rerender_list = async () => {
        await x.delay(0);

        this.cache.clearAll();
        this.list.current.forceUpdateGrid();
    }

    cache = new CellMeasurerCache({
        fixedWidth: true,
        minHeight: 24
    });

    render() {
        work_folder.ob.chosen_folder_path

        const work_folder_path = store.get('work_folder');
        const number_of_rows = work_folder.ob.folders.length; // needs to be here, not in rowCount={}, otherwise scroll container wont resize on folder opening
        const work_folder_is_empty_message = work_folder.ob.folders.length == 0 ? <div className='work_folder_message'>{x.message(work_folder_path == '' ? 'work_folder_is_not_specified_message_text' : 'work_folder_is_empty_message_text')}</div> : null;

        return (
            <Fieldset name="work_folder">
                <div className={x.cls(['work_folder_selector', work_folder.ob.show_work_folder_selector ? '' : 'none'])}>
                    <button
                        className='btn choose_work_folder_btn'
                        data-text='choose_folder_btn_text'
                        onClick={choose_folder.choose_folder.bind(null, 'work_folder', work_folder.create_top_level_folders)}
                    ></button>
                    <span className='work_folder_path' title={work_folder_path}>{work_folder_path}</span>
                </div>
                {work_folder_is_empty_message}
                <AutoSizer>
                    {({ width, height }) => {
                        return (
                            <List
                                ref={this.list}
                                width={width}
                                height={height}
                                deferredMeasurementCache={this.cache}
                                rowHeight={this.cache.rowHeight}
                                rowRenderer={this.render_row}
                                rowCount={number_of_rows}
                                tabIndex={null}
                                onScroll={this.show_or_hide_choose_work_folder_btn}
                                style={{
                                    padding: '60px 12px 12px 8px',
                                    boxSizing: 'border-box',
                                }}
                            />
                        );
                    }
                    }
                </AutoSizer>
            </Fieldset >
        );
    }
}

Work_folder = observer(Work_folder);