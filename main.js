const { join } = require('path');
const { format } = require('url');
const { existsSync } = require('fs');

const { app, BrowserWindow, shell } = require('electron');

//--

const dev = !!(process.defaultApp
    || /[\\/]electron-prebuilt[\\/]/.test(process.execPath)
    || /[\\/]electron[\\/]/.test(process.execPath)); //> Keep a reference for dev mode
const runs_from_package = !existsSync(join(__dirname, 'resources'));
let main_window; // Keep a global reference of the window object, if you don't, the window will be closed automatically when the JavaScript object is garbage collected.
global.os_lang = null;

//> temporary fix broken high-dpi scale factor on Windows (125% scaling). info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {
    app.commandLine.appendSwitch('high-dpi-support', 'true');
    app.commandLine.appendSwitch('force-device-scale-factor', '1');
}
//< temporary fix broken high-dpi scale factor on Windows (125% scaling). info: https://github.com/electron/electron/issues/9691

function create_window() {
    //> create the browser window.
    main_window = new BrowserWindow({
        show: false,
        webPreferences: {
            nativeWindowOpen: true,
        },
    });
    //< create the browser window.

    //> implementing Webpack
    const index_path_return_val = dev && process.argv.indexOf('--noDevServer') === -1
        ? (() => {
            const index_path = format({
                protocol: 'http:',
                host: 'localhost:8080',
                pathname: 'index.html',
                slashes: true,
            });

            //> install react chrome extension
            // eslint-disable-next-line global-require
            const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer'); // needs to be here, otherwise packaged app will not start

            installExtension(REACT_DEVELOPER_TOOLS)
                /* eslint-disable no-console */
                .then(name => console.log(`Added Extension:  ${name}`))
                .catch(er => console.log('An error occurred: ', er));
            //< install react chrome extension

            return index_path;
        })()
        : (() => {
            const index_path = format({
                protocol: 'file:',
                pathname: join(
                    __dirname,
                    runs_from_package ? '' : 'resources',
                    runs_from_package ? '' : 'app',
                    'bundle',
                    'index.html',
                ),
                slashes: true,
            });

            return index_path;
        })();
    //< implementing Webpack

    main_window.loadURL(index_path_return_val);

    //> don't show until we are ready and loaded
    main_window.once('ready-to-show', () => {
        main_window.maximize();
        main_window.show();

        if (dev) { // open the DevTools automatically if developing
            main_window.webContents.openDevTools();
        }
    });
    //< don't show until we are ready and loaded

    //> Emitted when the window is closed.
    main_window.on('closed', () => {
        main_window = null; // Dereference the window object, usually you would store windows in an array if your app supports multi windows, this is the time when you should delete the corresponding element.
    });
    //< Emitted when the window is closed.

    //> open links inside of app in default browser
    main_window.webContents.on('new-window', (e, url) => {
        e.preventDefault();

        shell.openExternal(url);
    });
    //< open links inside of app in default browser

    //> get os language
    const available_langs = ['ru']; // except english;
    const os_loc = app.getLocale();
    const os_loc_sub_loc_cut = os_loc.indexOf('_') === -1 ? os_loc : os_loc.substr(0, os_loc.lastIndexOf('_'));
    global.os_lang = available_langs.find(available_lang => available_lang === os_loc_sub_loc_cut) || 'en';
    //< get os language
}

app.on('ready', create_window); // this method will be called when Electron has finished initialization and is ready to create browser windows. some APIs can only be used after this event occurs.

//> quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { // on macOS it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
        app.quit();
    }
});
//< quit when all windows are closed.

app.on('activate', () => {
    if (main_window === null) {
        create_window(); // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
    }
});
