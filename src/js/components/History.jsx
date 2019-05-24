import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';
import { List, AutoSizer, CellMeasurerCache, CellMeasurer } from 'react-virtualized';

import x from 'x';
import * as analytics from 'js/analytics';
import * as enter_click from 'js/enter_click';
import * as history from 'js/history';

import { Tr } from 'components/Tr';
import { Btn } from 'components/Btn';
import { Hr } from 'components/Hr';

import close_svg from 'svg/close';

export const History = observer(() => {
    const number_of_rows = history.ob.history.length;
    history.ob.reset_history_popup_content; // eslint-disable-line no-unused-expressions
    history.ob.revert_position; // eslint-disable-line no-unused-expressions

    const render_history_item_content = item => {
        try {
            if (item.family === 'colors' || item.family === 'tints') {
                if (!item.set_to_default && !item.set_to_disabled) {
                    return <Color_changed_to color={item.to_hex} />;

                }

                if (item.set_to_default) {
                    return <String name="set_to_default" />;
                }

                if (item.set_to_disabled) {
                    return <String name="set_to_disabled" />;
                }
            }

        } catch (er) {
            err(er, 212);
        }

        return undefined;
    };

    const close_history = () => {
        try {
            history.cancel_history_change();

            analytics.add_popup_close_btns_analytics('history');

        } catch (er) {
            err(er, 218);
        }
    };

    const cancel = () => {
        try {
            history.cancel_history_change();

            analytics.add_history_analytics('history_cancel');

        } catch (er) {
            err(er, 220);
        }
    };

    const revert_all = () => {
        try {
            history.revert_tinker(0);

            analytics.add_history_analytics('history_revert_all');

        } catch (er) {
            err(er, 219);
        }
    };

    const cache = new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 28,
    });

    const render_row = ({ index, parent, key, style }) => {
        const history_item = history.ob.history[index];

        return (
            <CellMeasurer
                key={key}
                cache={cache}
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
                    {render_history_item_content(history_item)}
                    <span className="history_item_date">{history.get_date_from_timestamp(history_item.timestamp)}</span>
                </div>
            </CellMeasurer>
        );
    };

    return (
        <Tr
            attr={{
                className: 'popup history_popup',
            }}
            tag="div"
            name="gen"
            state={history.ob.history_is_visible}
        >
            <button
                className="close_btn"
                type="button"
                onClick={close_history}
            >
                <Svg src={close_svg} />
            </button>
            <Hr name="history" />
            <div className="history">
                <AutoSizer>
                    {({ width, height }) => (
                        <List
                            width={width}
                            height={height}
                            deferredMeasurementCache={cache}
                            rowHeight={cache.rowHeight}
                            rowRenderer={render_row}
                            rowCount={number_of_rows}
                            tabIndex={null}
                        />
                    )}
                </AutoSizer>
            </div>
            <Btn
                name="history_accept"
                on_click={history.accept_history_change}
            />
            <Btn
                name="history_cancel"
                on_click={cancel}
            />
            <Btn
                name="history_revert_all"
                on_click={revert_all}
            />
        </Tr>
    );
});

const History_item_family_and_name = props => {
    const { family, name } = props;

    return (
        <React.Fragment>
            <span className="history_item_family">{x.msg(`${family}_hr_text`)}</span>
            |
            <span className="history_item_name">{x.msg(`${name}_label_text`)}</span>
            |
        </React.Fragment>
    );
};

const Color_changed_to = props => {
    const { color } = props;

    return (
        <React.Fragment>
            <span className="history_item_text">{x.msg('history_color_changed_to_text')}</span>
            <span
                className="history_item_color"
                title={color}
                style={{ backgroundColor: color }}
            />
            |
        </React.Fragment>
    );
};

const String = props => {
    const { name } = props;

    return (
        <React.Fragment>
            <span className="history_item_text">{x.msg(`history_${name}_text`)}</span>|
        </React.Fragment>
    );
};
