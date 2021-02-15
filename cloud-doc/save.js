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
  //new设置结束
  mainWindow.webContents.openDevTools();
  //设置原生菜单
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
});
