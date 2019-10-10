import React from 'react';
import { observer } from 'mobx-react';
import { List, AutoSizer, CellMeasurerCache, CellMeasurer } from 'react-virtualized';

import x from 'x';
import { selects_options } from 'js/selects_options';
import * as analytics from 'js/analytics';
import * as enter_click from 'js/enter_click';
import * as history from 'js/history';
import * as conds from 'js/conds';

import { Side_popup } from 'components/Side_popup';

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

    render_history_item_content = item => {
        try {

            if (conds.imgs(item.family, item.name)) {
                if (!item.set_to_default) {
                    if (item.to_rgba) {
                        return <Color_and_img_changed_to color={item.to_rgba} />;
                    }

                    return <String name="changed" />;
                }

            } else if (item.family === 'colors' || item.family === 'tints') {
                if (!item.set_to_default && !item.set_to_disabled) {
                    return <Color_and_img_changed_to color={item.to_hex} />;
                }

            } else if (conds.selects(item.family, item.name)) {
                return (
                    <Selects_changed_to
                        name={item.name}
                        val={item.to}
                    />
                );

            } else if (conds.textareas(item.family, item.name)) {
                return (
                    <Textarea_changed_to
                        val={item.to}
                    />
                );
            }

            if (item.set_to_default) {
                return <String name="set_to_default" />;
            }

            if (item.set_to_disabled) {
                return <String name="set_to_disabled" />;
            }

        } catch (er) {
            err(er, 212);
        }

        return undefined;
    };

    close_history = () => {
        try {
            history.cancel_history_change();

            analytics.add_popup_close_btns_analytics('history');

        } catch (er) {
            err(er, 218);
        }
    };

    cancel = () => {
        try {
            history.cancel_history_change();

            analytics.add_history_analytics('history_cancel');

        } catch (er) {
            err(er, 220);
        }
    };

    revert_all = () => {
        try {
            history.revert_tinker(0);

            analytics.add_history_analytics('history_revert_all');

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
                    className={x.cls(['history_item', index >= history.ob.revert_position ? 'reverted_history_item' : null])}
                    role="button"
                    tabIndex="0"
                    style={style}
                    onClick={history.revert_tinker.bind(null, index + 1)}
                    onKeyUp={enter_click.simulate_click_on_enter}
                >
                    <History_item_family_and_name
                        family={history_item.family}
                        name={history_item.name}
                    />
                    {this.render_history_item_content(history_item)}
                    <span className="history_item_date">{history.get_date_from_timestamp(history_item.timestamp)}</span>
                </div>
            </CellMeasurer>
        );
    };

    render() {
        const number_of_rows = history.ob.history.length;
        history.ob.revert_position; // eslint-disable-line no-unused-expressions

        return (
            <Side_popup
                popup_is_visible={history.ob.history_is_visible}
                name="history"
                additional_btns={[
                    {
                        key: x.unique_id(),
                        name: 'history_revert_all',
                        on_click: this.revert_all,
                    },
                ]}
                close_f={this.close_history}
                accept_f={history.accept_history_change}
                cancel_f={this.cancel}
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
                            ref={ref => this.list = ref} // eslint-disable-line no-return-assign
                        />
                    )}
                </AutoSizer>
            </Side_popup>
        );
    }
}

const History_item_family_and_name = props => {
    const { family, name } = props;

    return (
        <React.Fragment>
            <span className="history_item_family">{x.msg(`${family}_hr_text`) || x.msg(`${family}_legend_text`)}</span>
            |
            <span className="history_item_name">{x.msg(`${name}_label_text`)}</span>
            |
        </React.Fragment>
    );
};

const Color_and_img_changed_to = props => {
    const { color } = props;

    return (
        <React.Fragment>
            <Changed_to_text />
            <span
                className="history_item_color"
                title={color}
                style={{ backgroundColor: color }}
            />
            |
        </React.Fragment>
    );
};

const Selects_changed_to = props => {
    const { name, val } = props;
    const options = selects_options[name === 'default_locale' ? 'locale' : name];
    const { label } = options.find(option => option.value === val) || { label: '' };

    return (
        <React.Fragment>
            <Changed_to_text />
            <span className="history_item_changed_to">{`"${label}"`}</span>
            |
        </React.Fragment>
    );
};

const Textarea_changed_to = props => {
    const { val } = props;
    return (
        <React.Fragment>
            <Changed_to_text />
            <span className="history_item_changed_to">{`"${val}"`}</span>
            |
        </React.Fragment>
    );
};

const Changed_to_text = () => <span className="history_item_text">{x.msg('history_changed_to_text')}</span>;

const String = props => {
    const { name } = props;

    return (
        <React.Fragment>
            <span className="history_item_text">{x.msg(`history_${name}_text`)}</span>|
        </React.Fragment>
    );
};

observer(History);
