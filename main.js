const dataURL = "'data.json'";

const category_list = document.getElementById("category-list");
const product_list = document.getElementById("product-list");
const cartButton = document.getElementById("cart");
const cart_items = document.getElementById("cart-items");
const page_title = document.getElementById("page-title");

cartButton.addEventListener(
  "click",
  function () {
    goToCart();
  },
  false
);

var cart = {};

// Obtener los datos y crear la tabla
fetch("data.json", {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})
  .then((response) => response.json())
  .then((info) => {
    data = info;
    console.log(data);

    data.forEach((element) => {
      console.log(element["name"]);
      const li = document.createElement("li");
      li.classList.add("nav-item", "px-3");
      category_list.appendChild(li);
      const a = document.createElement("a");
      a.classList.add("nav-link", "active");
      a.setAttribute("aria-current", "page");
      a.addEventListener(
        "click",
        function () {
          viewProducts(element["name"], element["products"]);
        },
        false
      );
      li.appendChild(a);
      const text = document.createTextNode(element["name"]);
      a.appendChild(text);
    });
    viewProducts(data[0]["name"], data[0]["products"]);
  });

function viewProducts(category, products) {
  product_list.innerHTML = "";
  page_title.innerHTML = "";

  var grid = document.createElement("div");
  grid.classList.add("row", "row-cols-4", "g-4");
  product_list.appendChild(grid);

  products.forEach((product) => {
    //console.log(product["name"]);+
    var div0 = document.createElement("div");
    div0.classList.add("col");
    grid.appendChild(div0);

    var div1 = document.createElement("div");
    div1.classList.add("card", "h-100");
    div1.setAttribute("style", "width: 18rem");
    div0.appendChild(div1);

    var img = document.createElement("img");
    img.setAttribute("src", product["image"]);
    img.setAttribute("alt", product["name"]);
    img.setAttribute("style", "width: 18rem;height: 10rem; object-fit: cover;");
    img.classList.add("card-img-top");

    var card_body = document.createElement("div");
    card_body.classList.add("card-body", "d-flex", "flex-column");

    div1.appendChild(img);
    div1.appendChild(card_body);

    var h5 = document.createElement("h5");
    h5.classList.add("card-title");
    var text = document.createTextNode(product["name"]);
    h5.appendChild(text);

    var p = document.createElement("p");
    text = document.createTextNode(product["description"]);
    p.appendChild(text);
    p.classList.add("card-text");

    p2 = document.createElement("p");
    text = document.createTextNode(product["price"]);
    p2.appendChild(text);
    p2.classList.add("card-text", "fw-bold");

    var a = document.createElement("a");
    a.classList.add("btn", "btn-dark", "mt-auto");
    text = document.createTextNode("Add to cart");
    a.setAttribute("style", "width: 7rem;");
    a.appendChild(text);

    card_body.appendChild(h5);
    card_body.appendChild(p);
    card_body.appendChild(p2);
    card_body.appendChild(a);

    a.addEventListener(
      "click",
      function () {
        addToCart(product);
      },
      false
    );
  });
  var title = document.createElement("h2");
  title.classList.add("text-center");
  text = document.createTextNode(category);
  page_title.appendChild(title);
  title.appendChild(text);
}

function addToCart(product) {
  if (cart[product["name"]] == null)
    cart[product["name"]] = {
      product,
      qty: 0,
    };
  cart[product["name"]]["qty"] += 1;

  console.log(cart);
  items = amountOfItems();
  cart_items.innerHTML = items + " items";
}

function goToCart() {
  product_list.innerHTML = "";
  page_title.innerHTML = "";

  var title = document.createElement("h2");
  title.classList.add("text-center");
  text = document.createTextNode("Order detail");
  page_title.appendChild(title);
  title.appendChild(text);

  var table = document.createElement("table");
  table.classList.add("table", "table-striped");
  product_list.appendChild(table);
  var head = document.createElement("thead");
  var body = document.createElement("tbody");

  table.appendChild(head);
  table.appendChild(body);
  head.innerHTML =
    '<tr><th scope="col">Item</th><th scope="col">Qty.</th><th scope="col">Description</th><th scope="col">Unit Price</th><th scope="col">Amount</th><th scope="col">Modify</th></tr>';

  var i = 0;
  var total = 0;
  for (const [key, value] of Object.entries(cart)) {
    console.log(value);
    i += 1;
    var newRow = body.insertRow(-1);
    newRow.setAttribute("id", key);

    price = createRow(newRow, key, value, i);

    total += price;
  }
  var table_foot =
    '<div class="row"><div class="col"><p class="fw-bold">Total:$' +
    total +
    '</p></div><div class="col"><div class="float-end"><button class="btn btn-danger">Cancel</button><button class="btn btn-light">Confirmn</button></div></div></div>';
  var table_end = document.createElement("div");
  table_end.setAttribute("id", "table_end");
  table_end.innerHTML = table_foot;
  product_list.appendChild(table_end);
}

function amountOfItems() {
  var am = 0;
  for (const [key, value] of Object.entries(cart)) {
    am += value["qty"];
  }
  return am;
}

function addProduct(product_name) {
  cart[product_name]["qty"] += 1;
  //console.log(cart);
  const thisRow = document.getElementById(product_name);
  addQtyRow(thisRow);
  const total = calcTotal();
  const table_foot =
    '<div class="row"><div class="col"><p class="fw-bold">Total:$' +
    total +
    '</p></div><div class="col"><div class="float-end"><button class="btn btn-danger">Cancel</button><button class="btn btn-light">Confirmn</button></div></div></div>';
  const table_end = document.getElementById("table_end");
  table_end.innerHTML = table_foot;
}

function removeProduct(product_name) {
  cart[product_name]["qty"] -= 1;
  //console.log(cart);
  const thisRow = document.getElementById(product_name);
  rmQtyRow(thisRow);
  const total = calcTotal();
  const table_foot =
    '<div class="row"><div class="col"><p class="fw-bold">Total:$' +
    total +
    '</p></div><div class="col"><div class="float-end"><button class="btn btn-danger">Cancel</button><button class="btn btn-light">Confirmn</button></div></div></div>';
  const table_end = document.getElementById("table_end");
  table_end.innerHTML = table_foot;
}

function createRow(newRow, key, value, i) {
  total = 0;
  var newCell = newRow.insertCell(-1);
  var newText = document.createTextNode(i);
  newCell.appendChild(newText);

  var qty = value["qty"];
  newCell = newRow.insertCell(-1);
  newText = document.createTextNode(qty);
  newCell.appendChild(newText);

  newCell = newRow.insertCell(-1);
  newText = document.createTextNode(key);
  newCell.appendChild(newText);

  var price = value["product"]["price"];
  newCell = newRow.insertCell(-1);
  newText = document.createTextNode(price);
  newCell.appendChild(newText);

  newCell = newRow.insertCell(-1);
  newText = document.createTextNode(price * qty);
  newCell.appendChild(newText);

  newCell = newRow.insertCell(-1);
  var add = document.createElement("button");
  add.innerHTML = "+";
  add.classList.add("btn", "btn-secondary", "mx-1");
  add.addEventListener(
    "click",
    function () {
      addProduct(key);
    },
    false
  );
  var remove = document.createElement("button");
  remove.innerHTML = "-";
  remove.classList.add("btn", "btn-secondary", "mx-1");
  remove.addEventListener(
    "click",
    function () {
      removeProduct(key);
    },
    false
  );
  newCell.appendChild(add);
  newCell.appendChild(remove);

  return price * qty;
}

function addQtyRow(row) {
  const qty = parseInt(row.cells.item(1).innerHTML);
  row.cells.item(1).innerHTML = qty + 1;
  row.cells.item(4).innerHTML =
    parseFloat(row.cells.item(3).innerHTML) * (qty + 1);
}

function rmQtyRow(row) {
  const qty = parseInt(row.cells.item(1).innerHTML);
  row.cells.item(1).innerHTML = qty - 1;
  row.cells.item(4).innerHTML =
    parseFloat(row.cells.item(3).innerHTML) * (qty - 1);
}

function calcTotal() {
  var total = 0;
  for (const [key, value] of Object.entries(cart)) {
    const price = value["product"]["price"];
    const qty = value["qty"];
    total += price * qty;
  }
  return total;
}
