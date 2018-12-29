import Store from 'electron-store';
import ua from 'universal-analytics';

const store = new Store();

//--

const visitor = ua('UA-129081690-1');

export const send_pageview = page => {
    try {
        const analytics_enabled = typeof store.get('enable_analytics') === 'undefined' ? true : store.get('enable_analytics');
        const enable_analytics_dev = typeof store.get('enable_analytics_dev') === 'undefined' ? false : store.get('enable_analytics_dev');

        if ((!sta.dev && analytics_enabled) || enable_analytics_dev) {
            visitor.pageview(page).send();
        }

    } catch (er) {
        err(er, 153);
    }
};

//> variables
export const sta = {
    dev: !!(process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)),
};
//< variables
