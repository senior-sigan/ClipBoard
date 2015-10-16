'use strict';

const app = require('app');  // Module to control application life.
const BrowserWindow = require('browser-window');  // Module to create native browser window.
const ipc = require('ipc');
const Menu = require('menu');
const Tray = require('tray');
const path = require('path');

// Report crashes to our server.
require('crash-reporter').start();

const icon = path.join(__dirname, 'icon.png');
const menuTemplate = [{
  label: 'Clipboard',
  click: showWindow
},{
  label: 'Minimize to tray',
  click: hideWindow
}, {
  label: 'Exit',
  click: app.quit
}];

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;
let tray = null;
let menu = new Menu.buildFromTemplate(menuTemplate);

app.dock.hide();

app.on('window-all-closed', function() {
  console.log('All windows closed');
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  tray = new Tray(icon);
  tray.setToolTip('This is my application.');
  tray.setContextMenu(menu);

  createWindow();
});

ipc.on('app-quit', () => {
  app.quit();
});

function hideWindow() {
  if (mainWindow) {
    mainWindow.hide();
  }
}

function showWindow(bounds) {
  if (mainWindow) {
    mainWindow.show();
  } else {
    createWindow();
  }
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 300,
    height: 300,
    show: true,
    //frame: false,
    //'standard-window': false,
    resizable: false
  });
  //mainWindow.on('blur', hideWindow);
  mainWindow.on('close', function (e) {
    e.preventDefault();
    hideWindow();
  });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Open the DevTools.
  mainWindow.openDevTools({detach: true});
}
