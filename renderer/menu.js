// require
// the menu module is a main process module,
// so to use it from the renderer, we have to do it through the remote moduele
const { remote, shell } = require("electron");

// create the menu template array
const template = [
  {
    label: "Items",
    submenu: [
      {
        label: "Add New",
        accelerator: "CmdOrCtrl+O",
        click() {
          $(".open-add-modal").click();
        }
      },
      {
        label: "Read Item",
        accelerator: "CmdOrCtrl+Enter",
        click() {
          window.openItem();
        }
      },
      {
        label: "Delete Item",
        accelerator: "CmdOrCtrl+Backspace",
        click() {
          window.deleteItem();
        }
      },
      {
        label: "Open in Browser",
        accelerator: "CmdOrCtrl+Shift+Enter",
        click() {
          window.openInBrowser();
        }
      },
      {
        type: "separator"
      },
      {
        label: "Search Items",
        accelerator: "CmdOrCtrl+S",
        click() {
          $("#search").focus();
        }
      }
    ]
  },
  {
    //Edit is always the 2nd Menu item by convention
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "pasteandmatchstyle" },
      { role: "delete" },
      { role: "selectall" }
    ]
  },
  {
    role: "window",
    submenu: [{ role: "minimize" }, { role: "close" }]
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click() {
          shell.openExternal("https://stackacademy.tv");
        }
      }
    ]
  }
];

// Mac specific
// You can find everything under Electron documentation under the Menu module
if (process.platform === "darwin") {
  // Add first menu item
  template.unshift({
    label: remote.app.getName(),
    submenu: [
      { role: "about" },
      { type: "separator" },
      { role: "services", submenu: [] },
      { type: "separator" },
      { role: "hide" },
      { role: "hideothers" },
      { role: "unhide" },
      { type: "separator" },
      { role: "quit" }
    ]
  });

  // mac extra window options
  // window item becomes 4th item as mac has added an item
  // again paste the window submenu from the online example
  template[3].submenu = [
    { role: "close" },
    { role: "minimize" },
    { role: "zoom" },
    { type: "separator" },
    { role: "front" }
  ];
}

// add menu to app
const menu = remote.Menu.buildFromTemplate(template);
remote.Menu.setApplicationMenu(menu);
