const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const menuTemplate = require("./src/menuTemplate");
const path = require("path");
const AppWindow = require("./src/AppWindow");
const isDev = require("electron-is-dev");
let mainWindow, settingsWindow;
app.on("ready", () => {
  // mainWindow = new BrowserWindow({
  //   width: 1124,
  //   height: 680,
  //   webPreferences: {
  //     nodeIntegration: true,
  //     // enableRemoteModule: true,
  //     enableRemoteModule: true,
  //   },
  // });

  // mainWindow.loadURL(urlLocation);

  //new设置--
  const mainWindowConfig = {
    width: 1124,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      // enableRemoteModule: true,
      enableRemoteModule: true,
    },
  };
  const urlLocation = isDev ? "http://localhost:3000" : "my";
  mainWindow = new AppWindow(mainWindowConfig, urlLocation);
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  //new设置结束
  mainWindow.webContents.openDevTools();
  //hook
  ipcMain.on("open-settings-window", () => {
    const settingsWindowConfig = {
      width: 500,
      height: 400,
      parent: mainWindow,
      webPreferences: {
        nodeIntegration: true,
        // enableRemoteModule: true,
        enableRemoteModule: true,
      },
    };
    const settingsFileLocation = `file://${path.join(
      __dirname,
      "./settings/settings.html"
    )}`;
    settingsWindow = new AppWindow(settingsWindowConfig, settingsFileLocation);
    settingsWindow.on("closed", () => {
      settingsWindow = null;
    });
  });
  //设置原生菜单
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
});
//-------源应用
// app.on("ready", () => {
//   mainWindow = new BrowserWindow({
//     width: 1124,
//     height: 680,
//     webPreferences: {
//       nodeIntegration: true,
//       // enableRemoteModule: true,
//       enableRemoteModule: true,
//     },
//   });
//   const urlLocation = isDev ? "http://localhost:3000" : "my";
//   mainWindow.loadURL(urlLocation);
//   //new设置结束
//   mainWindow.webContents.openDevTools();
//   //设置原生菜单
//   const menu = Menu.buildFromTemplate(menuTemplate);
//   Menu.setApplicationMenu(menu);
// });
