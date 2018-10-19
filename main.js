'use strict'

// Import parts of electron to use
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const url = require('url');
const { existsSync } = require('fs');
const runs_from_package = !existsSync(path.join(__dirname, 'resources'));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let main_window;

// Keep a reference for dev mode
let dev = false;

if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
  dev = true;
}

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true');
  app.commandLine.appendSwitch('force-device-scale-factor', '1');
}

function create_window() {
  // Create the browser window.
  main_window = new BrowserWindow({
    show: false
  });

  // and load the index.html of the app.
  let index_path;

  // Implementing Webpack
  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    index_path = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    });

    const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));

  } else {
    index_path = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, runs_from_package ? '' : 'resources', runs_from_package ? '' : 'app', 'dist', 'index.html'),
      slashes: true
    });
  }

  main_window.loadURL(index_path);

  // Don't show until we are ready and loaded
  main_window.once('ready-to-show', () => {
    main_window.maximize();
    main_window.show();

    // Open the DevTools automatically if developing
    if (dev) {
      main_window.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  main_window.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    main_window = null;
  });

  // open links in default browser
  main_window.webContents.on('new-window', (e, url) => {
    e.preventDefault();

    shell.openExternal(url);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', create_window);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (main_window === null) {
    create_window();
  }
});