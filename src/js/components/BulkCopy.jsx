import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import { inputs_data } from 'js/inputs_data';
import * as bulk_copy from 'js/bulk_copy';
import * as analytics from 'js/analytics';

import { SidePopup } from 'components/SidePopup';
import { Checkbox } from 'components/Checkbox';
import { Btn } from 'components/Btn';
import { Hr } from 'components/Hr';

export class BulkCopy extends React.Component {
    close = () => {
        analytics.add_popup_close_btns_analytics('bulk_copy');

        bulk_copy.show_or_hide_bulk_copy(false);
    };

    cancel = () => {
        analytics.add_bulk_copy_analytics('cancel');

        bulk_copy.show_or_hide_bulk_copy(false);
    };

    render() {
        return (
            <SidePopup
                popup_is_visible={bulk_copy.ob.bulk_copy_is_visible}
                name='bulk_copy'
                additional_btns={[
                    {
                        key: x.unique_id(),
                        name: 'bulk_copy_select_all',
                        on_click: () => bulk_copy.select_or_deselect_all_global(true),
                    },
                    {
                        key: x.unique_id(),
                        name: 'bulk_copy_deselect_all',
                        on_click: () => bulk_copy.select_or_deselect_all_global(false),
                    },
                    {
                        key: x.unique_id(),
                        name: 'bulk_copy_select_default',
                        on_click: () => bulk_copy.select_default(),
                    },
                    {
                        key: x.unique_id(),
                        name: 'bulk_copy_set_default',
                        on_click: () => bulk_copy.toggle_set_default_mode(true),
                    },
                ]}
                close_f={this.close}
                accept_f={bulk_copy.accept}
                cancel_f={this.cancel}
            >
                {Object.keys(inputs_data.obj).map((family, i) => {
                    if (family !== 'options') {
                        const checkboxes = Object.values(inputs_data.obj[family]).map(
                            (item, i2) => {
                                const { name } = item;

                                if (name !== 'locale') {
                                    return (
                                        <Checkbox
                                            // eslint-disable-next-line react/no-array-index-key
                                            key={i2}
                                            family={family}
                                            name={item.name}
                                            checkbox_type='bulk_copy'
                                            on_change_bulk_copy={() =>
                                                bulk_copy.toggle_checkbox(family, item.name)
                                            }
                                        />
                                    );
                                }

                                return undefined;
                            },
                        );

                        return (
                            <div
                                // eslint-disable-next-line react/no-array-index-key
                                key={i}
                            >
                                <Hr name={family} />
                                <div className='bulk_copy_side_popup_content_btns'>
                                    <Btn
                                        name='bulk_copy_select_all'
                                        on_click={() =>
                                            bulk_copy.select_or_deselect_all_family(
                                                family,
                                                true,
                                                true,
                                            )
                                        }
                                    />
                                    <Btn
                                        name='bulk_copy_deselect_all'
                                        on_click={() =>
                                            bulk_copy.select_or_deselect_all_family(
                                                family,
                                                false,
                                                true,
                                            )
                                        }
                                    />
                                </div>
                                <div className='bulk_copy_side_popup_content_checkboxes'>
                                    {checkboxes}
                                </div>
                            </div>
                        );
                    }

                    return null;
                })}
            </SidePopup>
        );
    }
}

observer(BulkCopy);
