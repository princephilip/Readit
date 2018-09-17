// module
const { BrowserWindow } = require("electron");

// BrowserWindow instance
exports.win;

//mainWindow createWindow fn
exports.createWindow = () => {
  this.win = new BrowserWindow({
    width: 500,
    height: 600,
    minWidth: 350,
    maxWidth: 650,
    minHeight: 310,
    icon: `${__dirname}/icons/64x64.png`
  });

  // local main window content
  this.win.loadURL(`file://${__dirname}/renderer/main.html`);

  // handle window closed
  this.win.on("closed", () => {
    this.win = null;
  });
};
