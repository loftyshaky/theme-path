import React from 'react';
import { observer } from 'mobx-react';
import { List, AutoSizer, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import tinycolor from 'tinycolor2';

import x from 'x';
import { selects_options } from 'js/selects_options';
import * as enter_click from 'js/enter_click';
import * as history from 'js/history';
import * as conds from 'js/conds';

import { SidePopup } from 'components/SidePopup';

export class History extends React.Component {
    cache = new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 28,
    });

    constructor(props) {
        super(props);

        history.met.reset_history_side_popup_content = () => {
            try {
                this.cache.clearAll();
            } catch (er) {
                err(er, 216);
            }
        };
    }

    async componentDidUpdate() {
        this.list.forceUpdateGrid();

        if (history.mut.scroll_to_bottom_of_history) {
            history.mut.scroll_to_bottom_of_history = false;

            this.list.scrollToRow(Infinity);

            await x.delay(0);

            this.list.scrollToRow(Infinity);

            await x.delay(0);
            const history_scroll_container = s('.history_side_popup .ReactVirtualized__Grid');
            history_scroll_container.scrollTop = history_scroll_container.scrollHeight;
        }
    }

    render_history_item_content = (item) => {
        try {
            if (conds.imgs(item.family, item.name)) {
                if (!item.set_to_default) {
                    if (item.to_val) {
                        return <ColorAndImgChangedTo color={item.to_val} />;
                    }

                    return <String name='changed' />;
                }
            } else if (item.family === 'colors') {
                if (!item.set_to_default) {
                    return <ColorAndImgChangedTo color={item.to_val} />;
                }
            } else if (item.family === 'tints') {
                if (!item.set_to_default && !item.set_to_disabled) {
                    return (
                        <TextareaChangedTo val={(item.to_manifest_val || item.to_val).join('/')} />
                    );
                }
            } else if (conds.selects(item.family, item.name)) {
                return <SelectsChangedTo name={item.name} val={item.to_val} />;
            } else if (
                conds.textareas(item.family, item.name) ||
                conds.textareas_with_default_checkbox(item.family, item.name)
            ) {
                if (!item.set_to_default) {
                    return <TextareaChangedTo val={item.to_val} />;
                }
            }

            if (item.set_to_default) {
                return <String name='set_to_default' />;
            }

            if (item.set_to_disabled) {
                return <String name='set_to_disabled' />;
            }
        } catch (er) {
            err(er, 212);
        }

        return undefined;
    };

    revert_all = () => {
        try {
            history.revert_tinker(0);
        } catch (er) {
            err(er, 219);
        }
    };

    render_row = ({ index, parent, key, style }) => {
        const history_item = history.ob.history[index];

        return (
            <CellMeasurer
                key={key}
                cache={this.cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}
            >
                <div
                    key={key}
                    className={x.cls([
                        'history_item',
                        index >= history.ob.revert_position ? 'reverted_history_item' : null,
                    ])}
                    role='button'
                    tabIndex='0'
                    style={style}
                    onClick={history.revert_tinker.bind(null, index + 1)}
                    onKeyUp={enter_click.simulate_click_on_enter}
                >
                    <HistoryItemFamilyAndName
                        family={history_item.family}
                        name={history_item.name}
                    />
                    {this.render_history_item_content(history_item)}
                    <span className='history_item_date'>
                        {history.get_date_from_timestamp(history_item.timestamp)}
                    </span>
                </div>
            </CellMeasurer>
        );
    };

    render() {
        const number_of_rows = history.ob.history.length;
        history.ob.revert_position; // eslint-disable-line no-unused-expressions

        return (
            <SidePopup
                popup_is_visible={history.ob.history_is_visible}
                name='history'
                additional_btns={[
                    {
                        key: x.unique_id(),
                        name: 'history_revert_all',
                        on_click: this.revert_all,
                    },
                ]}
                close_f={history.cancel_history_change}
                accept_f={history.accept_history_change}
                cancel_f={history.cancel_history_change}
            >
                <AutoSizer>
                    {({ width, height }) => (
                        <List
                            width={width}
                            height={height}
                            deferredMeasurementCache={this.cache}
                            rowHeight={this.cache.rowHeight}
                            rowRenderer={this.render_row}
                            rowCount={number_of_rows}
                            tabIndex={null}
                            ref={(ref) => (this.list = ref)} // eslint-disable-line no-return-assign
                        />
                    )}
                </AutoSizer>
            </SidePopup>
        );
    }
}

const HistoryItemFamilyAndName = (props) => {
    const { family, name } = props;

    return (
        <>
            <span className='history_item_family'>
                {x.msg(`${family}_hr_text`) || x.msg(`${family}_legend_text`)}
            </span>
            |<span className='history_item_name'>{x.msg(`${name}_label_text`)}</span>|
        </>
    );
};

const ColorAndImgChangedTo = (props) => {
    const { color } = props;
    const tinycolor_color = tinycolor(color);
    // eslint-disable-next-line no-underscore-dangle

    return (
        <>
            <ChangedToText />
            <span
                className='history_item_color'
                // eslint-disable-next-line no-underscore-dangle
                title={`${
                    // eslint-disable-next-line no-underscore-dangle
                    tinycolor_color._a === 1
                        ? tinycolor_color.toHexString()
                        : tinycolor_color.toHex8String()
                } / ${tinycolor_color.toRgbString()} / ${tinycolor_color.toHsvString()}`}
                style={{ backgroundColor: color }}
            />
            |
        </>
    );
};

const SelectsChangedTo = (props) => {
    const { name, val } = props;
    const options = selects_options[name === 'default_locale' ? 'locale' : name];
    const { label } = options.find((option) => option.value === val) || { label: '' };

    return (
        <>
            <ChangedToText />
            <span className='history_item_changed_to'>{`"${label}"`}</span>|
        </>
    );
};

const TextareaChangedTo = (props) => {
    const { val } = props;

    return (
        <>
            <ChangedToText />
            <span className='history_item_changed_to'>{`"${val}"`}</span>|
        </>
    );
};

const ChangedToText = () => (
    <span className='history_item_text'>{x.msg('history_changed_to_text')}</span>
);

const String = (props) => {
    const { name } = props;

    return (
        <>
            <span className='history_item_text'>{x.msg(`history_${name}_text`)}</span>|
        </>
    );
};

observer(History);
