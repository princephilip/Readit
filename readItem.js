// modules
const { BrowserWindow } = require("electron");

// BrowserWindow
let bgItemWin;

// New read item method
module.exports = (url, callback) => {
  // Create New offScreen BrowserWindow
  bgItemWin = new BrowserWindow({
    width: 1000,
    height: 1000,
    show: false,
    webPreferences: {
      offscreen: true
    }
  });

  //   Load the itemUrl into this window
  bgItemWin.loadURL(url);

  // wait for the content to finish loading
  bgItemWin.webContents.on("did-finish-load", () => {
    // get a screenshot (thumnail)
    bgItemWin.webContents.capturePage(image => {
      // Get the image as a dataURI
      let screenshot = image.toDataURL();

      // Get page title
      let title = bgItemWin.getTitle();
      //   REturn new item via callback
      callback({ title, screenshot, url });
      // Clean up
      bgItemWin.close();
      bgItemWin = null;
    });
  });
};
