import { action, observable, configure } from 'mobx';
import Store from 'electron-store';

import * as analytics from 'js/analytics';

const store = new Store();

configure({ enforceActions: 'observed' });

export const increment_tutorial_stage = action((tutorial_completed, send_event_to_analytics) => {
    try {
        if (send_event_to_analytics) {
            analytics.add_tutorial_analytics('incremented_stage');
        }

        apply_alt_style_change_theme_properties_tutorial_item();

        const new_tutorial_stage = tutorial_completed ? 'tutorial_completed' : ob.tutorial_stage + 1;

        ob.tutorial_stage = new_tutorial_stage;

        store.set('tutorial_stage', new_tutorial_stage);

        show_or_hide_tutorial_item(true);

    } catch (er) {
        err(er, 150);
    }
});

export const apply_alt_style_change_theme_properties_tutorial_item = action(() => {
    try {
        const theme_metadata_and_theme_fieldset_w_top = s('.theme_metadata_and_theme_fieldset_w').getBoundingClientRect().top;

        enable_or_disable_alt_style(theme_metadata_and_theme_fieldset_w_top > 150);

    } catch (er) {
        err(er, 324);
    }
});


export const show_or_hide_tutorial_item = action(bool => {
    try {
        ob.tutorial_item_is_visible = bool;

    } catch (er) {
        err(er, 151);
    }
});

const enable_or_disable_alt_style = action(bool => {
    try {
        ob.alt_style_enabled = bool;

    } catch (er) {
        err(er, 156);
    }
});

export const ob = observable({
    tutorial_stage: store.get('tutorial_stage') || 1,
    tutorial_item_is_visible: true,
    alt_style_enabled: false,
});

export const mut = {
    recursive_apply_alt_style_if_tutorial_item_out_of_screen_already_called: false,
};
