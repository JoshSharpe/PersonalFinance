const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

require('./dist/server.js');

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 1360, height: 800});
  mainWindow.loadURL('http://localhost:8080');
  mainWindow.openDevTools();
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
