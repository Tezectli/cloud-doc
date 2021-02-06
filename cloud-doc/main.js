const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
let mainWindow;
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1124,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      // enableRemoteModule: true,
      enableRemoteModule: true,
    },
  });
  const urlLocation = isDev ? "http://localhost:3000" : "my";
  mainWindow.loadURL(urlLocation);
  mainWindow.webContents.openDevTools();
});
