const { app, BrowserWindow, Menu, ipcMain, globalShortcut } = require('electron');

const path = require('path');

let mainWindow = null;
let remoteControlWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 650,
    minWidth: 960,
    minHeight: 650,
    show: false,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false
    }
  })

  const startUrl =
    process.env.NODE_ENV === 'dev'
      ? 'http://localhost:3000'
      : path.join(__dirname, "/build/index.html");

  mainWindow.loadURL(startUrl);
  Menu.setApplicationMenu(null);
  mainWindow.webContents.openDevTools();
}


const showRemoteControlWindow = () => {
  remoteControlWindow = new BrowserWindow({
    width: 1000,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  const startUrl = path.join(__dirname, "./remote-control.html");
  console.log('startUrl', startUrl);
  remoteControlWindow.loadURL(startUrl);
}

const initMaindowEvent = () => {
  mainWindow.on('closed', () => {
    mainWindow = null;
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  })
}


const initAppEvent = () => {
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  })

  app.on('activate', () => {
    if (mainWindow === null) createWindow();
  })
}

const initIpcMain = () => {
  ipcMain.on('wx-screenshot', () => {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
      mainWindow.focus();
    }
  })

  ipcMain.on('min-window', (e, arg) => {  //最小化窗口
    mainWindow.minimize();
    if (arg && arg.type === 'screenshot') {
      e.returnValue = true;
    }
  })

  ipcMain.on('save-file', (e, arg) => {
    mainWindow.webContents.downloadURL(arg);
  })

  ipcMain.on('register-screenshot-key', (e) => {
    globalShortcut.register("CommandOrControl+X", () => {
      mainWindow.webContents.send('key-wx-screenshot');
    });
  })

  ipcMain.on('register-screenshot-key', (e) => {
    globalShortcut.register("CommandOrControl+X", () => {
      mainWindow.webContents.send('key-wx-screenshot');
    });
  })

  ipcMain.on('unregister-screenshot-key', (e) => {
    globalShortcut.unregisterAll();
  })

  ipcMain.handle('get-local-code', e => {
    let num = Math.floor(Math.random() * (999999999 - 100000000) + 100000000) + '';
    num = num.replace(/\s/g, '').replace(/(\w{3})(?=\w)/g, '$1 ');
    return num;
  })

  ipcMain.on('control-remote-desktop', (e, val) => {
    console.log('control-remote-desktop');
    showRemoteControlWindow();
  })

}



app.whenReady().then(() => {
  initAppEvent();
  createWindow();
  initMaindowEvent();
  initIpcMain();
  require('./new-robot.js')();
})