const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const menuTemplate = require("./src/menuTemplate");
const path = require("path");
const AppWindow = require("./src/AppWindow");
const isDev = require("electron-is-dev");
const QiniuManager = require("./src/utils/QiniuManager");
let mainWindow, settingsWindow;
const createManager = () => {
  var accessKey = "vp8-Un6KvnWmRaN3WYY5w1l84rY1nri0ecJ31rq0";
  var secretKey = "fQeEyqUiUX6eXFBY8XggqrQJDHBwD9PtuqvH6t3K";
  const bucketName = "reactcloud";
  return new QiniuManager(accessKey, secretKey, bucketName);
};
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

  //设置文件自动同步
  ipcMain.on("upload-file", (event, data) => {
    const manager = createManager();
    manager
      .uploadFile(data.key, data.path)
      .then((data) => {
        console.log("上传成功" + data);
        //传回渲染进程
        mainWindow.webContents.send("active-file-uploaded");
      })
      .catch(() => {
        dialog.showErrorBox("同步失败", "请检查七牛云参数是否正确");
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
