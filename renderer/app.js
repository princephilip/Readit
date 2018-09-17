const { ipcRenderer } = require("electron");
const items = require("./items.js");
const menu = require("./menu.js");

// Perform this action based on key presed up/down
$(document).keydown(e => {
  switch (e.key) {
    case "ArrowUp":
      items.changeItem("up");
      break;
    case "ArrowDown":
      items.changeItem("down");
      break;
  }
});

// Show add-modal //this is jquery
$(".open-add-modal").click(() => {
  $("#add-modal").addClass("is-active");
});

// close add modal
$(".close-add-modal").click(() => {
  $("#add-modal").removeClass("is-active");
});

// Handle add modal submission
$("#add-button").click(() => {
  const newItemURL = $("#item-input").val();

  if (newItemURL) {
    // Disable the Modal UI
    $("#item-input").prop("disabled", true);
    $("#add-button").addClass("is-loading");
    $(".close-add-modal").addClass("is-disabled");

    // Send the url to the main process via IPC
    ipcRenderer.send("new-item", newItemURL);
  }
});

// Listen for new item from main
ipcRenderer.on("new-item-success", (e, item) => {
  // Add item to items array
  items.toreadItems.push(item);

  // save items
  items.saveItems();

  // Add the Item object below the panel
  items.addItem(item);
  console.log(item);

  // Close modal once we received the item
  $("#add-modal").removeClass("is-active");
  $("#item-input")
    .prop("disabled", false)
    .val("");

  //clear input value
  $("#add-button").removeClass("is-loading");
  $(".close-add-modal").removeClass("is-disabled");
});

// if this is the first item, select it
if (items.toreadItems.length === 1) {
  $(".read-item:first()").addClass("is-active");
}

//Simulate add click on enter
$("#item-input").keyup(e => {
  if (e.key === "Enter") $("#add-button").click();
});

// filter items by title
$("#search").keyup(e => {
  // Get current search input value
  let filter = $(e.currentTarget).val();

  // i = index, el= element
  $(".read-item").each((i, el) => {
    // ref. the el as a jquery selector, use text() since title is the only text
    $(el)
      .text()
      .toLowerCase()
      .includes(filter)
      ? $(el).show()
      : $(el).hide();
  });
});

// Add item with app loads
if (items.toreadItems.length) items.toreadItems.forEach(items.addItem);
$(".read-item:first()").addClass("is-active");
