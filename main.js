// Modules
const { app, ipcMain } = require("electron");
const mainWindow = require("./mainWindow");
const readItem = require("./readItem");

// Listen for new read item
ipcMain.on("new-item", (e, itemURL) => {
  // Get read item with readItem module
  readItem(itemURL, item => {
    // console.log(item);
    // Send to renderer
    e.sender.send("new-item-success", item);
  });
});

// call createWindow on ready
app.on("ready", mainWindow.createWindow);

// quit when all windows are closed
app.on("window-all-closed", () => {
  // quit if its not mac
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  //  in OSX it's possible to re-create a window when icon is clicked
  if (mainWindow === null) {
    mainWindow.createWindow();
  }
});
