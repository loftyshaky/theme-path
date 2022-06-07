const { join } = require('path');
const { format } = require('url');
const { existsSync } = require('fs');

// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow, shell, Menu, ipcMain, session } = require('electron');
const remote = require('@electron/remote/main');
const ElectronStore = require('electron-store');

const { autoUpdater } = require('electron-updater');

remote.initialize();

ElectronStore.initRenderer();

global.dev = !!(
    process.defaultApp ||
    /[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
    /[\\/]electron[\\/]/.test(process.execPath)
); //> Keep a reference for dev mode
global.os_lang = null;
const runs_from_package = !existsSync(join(__dirname, 'resources'));
const app_is_running_as_windows_store_app = process.windowsStore;
let let_app_close = false;
let main_window; // Keep a global reference of the window object, if you don't, the window will be closed automatically when the JavaScript object is garbage collected.

//> temporary fix broken high-dpi scale factor on Windows (125% scaling). info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {
    app.commandLine.appendSwitch('high-dpi-support', 'true');
    app.commandLine.appendSwitch('force-device-scale-factor', '1');
}
//< temporary fix broken high-dpi scale factor on Windows (125% scaling). info: https://github.com/electron/electron/issues/9691

//> auto update
if (!app_is_running_as_windows_store_app) {
    ipcMain.on('install_update', () => {
        let_app_close = true;

        autoUpdater.quitAndInstall();
    });
}
//< auto update

function create_window() {
    //> create the browser window.
    main_window = new BrowserWindow({
        show: false,
        webPreferences: {
            nativeWindowOpen: true,
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    //< create the browser window.

    remote.enable(main_window.webContents);

    //> Remove default menubar
    main_window.setMenuBarVisibility(false);
    //< Remove default menubar

    //> implementing Webpack
    const index_path_return_val =
        global.dev && process.argv.indexOf('--noDevServer') === -1
            ? (() => {
                  const index_path = format({
                      protocol: 'http:',
                      host: 'localhost:8080',
                      pathname: 'index.html',
                      slashes: true,
                  });

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
    });
    //< don't show until we are ready and loaded

    main_window.webContents.on('did-frame-finish-load', () => {
        if (global.dev) {
            // open the DevTools automatically if developing
            main_window.webContents.openDevTools();

            main_window.webContents.on('devtools-opened', () => {
                main_window.focus();
            });
        }
    });

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

    //> context menu
    const selection_menu = Menu.buildFromTemplate([
        { role: 'copy' },
        { type: 'separator' },
        { role: 'selectall' },
    ]);

    const input_menu = Menu.buildFromTemplate([
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { type: 'separator' },
        { role: 'selectall' },
    ]);

    main_window.webContents.on('context-menu', (e, props) => {
        const { selectionText, isEditable } = props;
        if (isEditable) {
            input_menu.popup(main_window);
        } else if (selectionText && selectionText.trim() !== '') {
            selection_menu.popup(main_window);
        }
    });
    //< context menu

    //> get os language
    const available_langs = ['ru']; // except english;
    const os_loc = app.getLocale();
    const os_loc_sub_loc_cut =
        os_loc.indexOf('_') === -1 ? os_loc : os_loc.substr(0, os_loc.lastIndexOf('_'));
    global.os_lang =
        available_langs.find((available_lang) => available_lang === os_loc_sub_loc_cut) || 'en';
    //< get os language

    //> auto update
    if (!app_is_running_as_windows_store_app && !global.dev) {
        autoUpdater.checkForUpdates();

        autoUpdater.on('update-downloaded', () => {
            main_window.webContents.send('update_downloaded');
        });
    }
    //< auto update

    //> app close prompt
    main_window.on('close', (e) => {
        // eslint-disable-line prefer-arrow-callback
        if (let_app_close) {
            let_app_close = false;
        } else {
            e.preventDefault();

            main_window.webContents.send('close_app');
        }
    });
    //< app close prompt

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                'Content-Security-Policy': [
                    `default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'${
                        global.dev && process.argv.indexOf('--noDevServer') === -1
                            ? "; connect-src 'self' ws://localhost:8080"
                            : ''
                    }`,
                ],
                ...details.responseHeaders,
            },
        });
    });
}

app.on('ready', create_window); // this method will be called when Electron has finished initialization and is ready to create browser windows. some APIs can only be used after this event occurs.

//> quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // on macOS it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
        app.quit();
    }
});
//< quit when all windows are closed.

app.on('activate', () => {
    if (main_window === null) {
        create_window(); // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
    }
});

ipcMain.on('open_folder', (e, path) => {
    shell[process.platform === 'win32' ? 'openExternal' : 'openItem'](path);
});

ipcMain.on('show_folder', (e, path) => {
    shell.showItemInFolder(path);
});

ipcMain.on('set_let_app_close_var_to_true_and_close_app', () => {
    let_app_close = true;

    app.quit();
});

ipcMain.on('set_let_app_close_var_to_false', () => {
    let_app_close = false;
});

ipcMain.on('move_folder_to_trash', async (e, folder_path) => {
    if (existsSync(folder_path)) {
        try {
            await shell.trashItem(folder_path);
        } catch (er) {
            e.returnValue = true;
        }
    }

    e.returnValue = true;
});
