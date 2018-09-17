// keep track of items with an array
exports.toreadItems = JSON.parse(localStorage.getItem("toreadItems")) || [];

// Save items to localStorage. this is a key value store
exports.saveItems = () => {
  localStorage.setItem("toreadItems", JSON.stringify(this.toreadItems));
};
// select event handler
// Toggle item as selected
exports.selectItem = e => {
  $(".read-item").removeClass("is-active");
  $(e.currentTarget).addClass("is-active");
};

// Select next/prev item
exports.changeItem = direction => {
  // Get current active item
  let activeItem = $(".read-item.is-active");

  // Check direction and get next or previous read-item
  let newItem =
    direction === "down"
      ? activeItem.next(".read-item")
      : activeItem.prev(".read-item");

  // Only if item exists, make selection change
  if (newItem.length) {
    activeItem.removeClass("is-active");
    newItem.addClass("is-active");
  }
};

// Window function
// Delete item by index
window.deleteItem = (i = false) => {
  // if i isn't passed, set i to be the index of the currently selected item
  if (i === false) i = $(".read-item.is-active").index() - 1;

  // Remove item from DOM
  // select from the .read-item, the one with an index of i
  // the eq() is the array of index selected, starting at 0
  $(".read-item")
    .eq(i)
    .remove();

  // Remove from toreadItems array
  // the filter() runs an array through a function and
  // returns the new filtered array
  // item is the array item itself and the item's index array
  this.toreadItems = this.toreadItems.filter((item, index) => {
    return index !== i; //its because this has to return false.
    // meaning our delete item indext i must not be equal to index of the iterated item
  });

  // update storage
  this.saveItems();

  // select prev item or none if list is empty
  if (this.toreadItems.length) {
    // if item was deleted, select new first item, else previous item
    let newIndex = i === 0 ? 0 : i - 1;

    // Assign active class to new index
    // search an item with the index of newIndex and add this class to it
    $(".read-item")
      .eq(newIndex)
      .addClass("is-active");
  } else {
    // put back the no items message
    $("#no-items").show();
  }
};

// Open Item in default browser
window.openInBrowser = () => {
  // Only if items exits
  if (!this.toreadItems.length) return;

  // Get selected item
  let targetItem = $(".read-item.is-active");

  // Open in Browser
  require("electron").shell.openExternal(targetItem.data("url"));
};

// Open item for reading
window.openItem = () => {
  // Only if items have been added
  if (!this.toreadItems.length) return;

  // Get selected item
  let targetItem = $(".read-item.is-active");

  // Get item's content url (encode so we can send to readerURL as a query parameter, to be used in that window)
  let contentURL = encodeURIComponent(targetItem.data("url"));

  // Get the inndex of the item being opened to pass to proxy window
  //  the target.index() starts at 1, so we subtract 1, to get its array position
  let itemIndex = targetItem.index() - 1;

  // open the reader window with the url and itemIndex appended as a new query parameta
  readerWinURL = `file://${__dirname}/reader.html?url=${contentURL}&itemIndex=${itemIndex}`;

  // open item in proxy BrowserWindow
  let readerWin = window.open(readerWinURL, targetItem.data("title"));
};

// Add new item
exports.addItem = item => {
  // first hide the No Items message
  $("#no-items").hide();

  // New item html
  let itemHTML = `<a class="panel-block read-item" data-url=${
    item.url
  } data-title=${item.title} >
                    <figure class="image is-64x64 has-shadow thumb">
                        <img src="${item.screenshot}">
                    </figure>
                <h2 class="title is-4 column">${item.title}</h2>
                </a>`;
  // Append to read LIst
  $("#read-list").append(itemHTML);

  // Attach select event handler
  $(".read-item")
    .off("click, dblclick")
    .on("click", this.selectItem)
    .on("dblclick", window.openItem);
};
