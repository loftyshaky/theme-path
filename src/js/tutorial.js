import { action, observable, configure } from 'mobx';
import Store from 'electron-store';

const store = new Store();

configure({ enforceActions: 'observed' });

export const increment_tutorial_stage = action(tutorial_completed => {
    try {
        const new_tutorial_stage = tutorial_completed ? 'tutorial_completed' : ob.tutorial_stage + 1;

        ob.tutorial_stage = new_tutorial_stage;

        store.set('tutorial_stage', new_tutorial_stage);

        show_or_hide_tutorial_item(true);

    } catch (er) {
        err(er, 150);
    }
});

export const show_or_hide_tutorial_item = action(bool => {
    try {
        ob.tutorial_item_is_visible = bool;

    } catch (er) {
        err(er, 151);
    }
});

//> variables
export const ob = observable({
    tutorial_stage: store.get('tutorial_stage'),
    tutorial_item_is_visible: true,
});
//< variables
