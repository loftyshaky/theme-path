import Store from 'electron-store';

import x from 'x';

const store = new Store();

export const set_odd_elements_color = () => {
    const settings = store.get();

    const odd_elements_link_els = sa('link[class^="odd_elements_"]');

    x.remove_a(odd_elements_link_els);

    if (settings.highlight_odd_elements) {
        x.load_css(`odd_elements_${settings.theme}`);
    }
};
