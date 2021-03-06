const dataURL = "'data.json'";

/**
 * Elementos del DOM
 */
const category_list = document.getElementById("category-list");
const product_list = document.getElementById("product-list");
const cartButton = document.getElementById("cart");
const cart_items = document.getElementById("cart-items");
const page_title = document.getElementById("page-title");
const confirm_cancel_button = document.getElementById("confirm-cancel-button");

/**
 * Carrito
 */
var cart = {};

/**
 * Funcionalidad del Carrito
 */
cartButton.addEventListener(
  "click",
  function () {
    goToCart();
  },
  false
);

/**
 * Funcionalidad de cancelar orden
 */
confirm_cancel_button.onclick = cancelOrder;

/**
 * Obtener los datos y crear la interfax básica
 * Se puede hacer local utilizando la ruta local del .json y descomentando las lineas
 */
fetch(
  "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json" //, {
  //headers: {
  // "Content-Type": "application/json",
  //  Accept: "application/json",
  //},}
)
  .then((response) => response.json())
  .then((info) => {
    data = info;
    //console.log(data);

    data.forEach((element) => {
      //console.log(element["name"]);
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

/**
 * Visualizacion de los productos
 * @param {*} category
 * @param {*} products
 */
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

/**
 * Agregar un producto al carrito
 * @param {*} product
 */
function addToCart(product) {
  if (cart[product["name"]] == null)
    cart[product["name"]] = {
      product,
      qty: 0,
    };
  cart[product["name"]]["qty"] += 1;

  //console.log(cart);
  items = amountOfItems();
  cart_items.innerHTML = items + " items";
}

/**
 * Visualizacion del Carrito
 */
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
    //console.log(value);
    i += 1;
    var newRow = body.insertRow(-1);
    newRow.setAttribute("id", key);

    price = createRow(newRow, key, value, i);

    total += price;
  }
  var div_row = document.createElement("div");
  div_row.classList.add("row");
  var div_col1 = document.createElement("div");
  div_col1.classList.add("col");
  div_row.appendChild(div_col1);

  var p_tot = document.createElement("p");
  p_tot.setAttribute("id", "total_money");
  p_tot.classList.add("fw-bold");
  p_tot.innerHTML = "Total: $" + formatNumbers(total);
  div_col1.appendChild(p_tot);

  var div_col2 = document.createElement("div");
  div_col2.classList.add("col", "float-end");
  div_row.appendChild(div_col2);

  var div_3 = document.createElement("div");
  div_3.classList.add("float-end");
  div_col2.appendChild(div_3);

  var cancel = document.createElement("button");
  cancel.setAttribute("type", "button");
  cancel.classList.add("btn", "red-button", "mx-1");
  cancel.setAttribute("data-bs-toggle", "modal");
  cancel.setAttribute("data-bs-target", "#exampleModal");
  cancel.innerHTML = "Cancel";
  div_3.appendChild(cancel);

  var confirm = document.createElement("button");
  confirm.classList.add("btn", "white-button", "mx-1", "me-5");
  confirm.innerHTML = "Confirm order";
  confirm.addEventListener(
    "click",
    function () {
      confirmOrder();
    },
    false
  );
  div_3.appendChild(confirm);

  product_list.appendChild(div_row);
}

/**
 * Crear una fila de la tabla de OrdenDetail
 * @param {*} newRow
 * @param {*} key
 * @param {*} value
 * @param {*} i
 * @returns
 */
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
  newText = document.createTextNode(formatNumbers(price * qty));
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

/**
 * Conteo de items
 * @returns conteo
 */
function amountOfItems() {
  var am = 0;
  for (const [key, value] of Object.entries(cart)) {
    am += value["qty"];
  }
  return am;
}

/**
 * Agregar cantidad a un producto
 * @param {*} product_name
 */
function addProduct(product_name) {
  cart[product_name]["qty"] += 1;
  //console.log(cart);
  const thisRow = document.getElementById(product_name);
  addQtyRow(thisRow);
  const total = calcTotal();
  const total_money = document.getElementById("total_money");
  total_money.innerHTML = "Total: $" + formatNumbers(total);
}

/**
 * Disminuir cantidad a un producto
 * @param {*} product_name
 */
function removeProduct(product_name) {
  cart[product_name]["qty"] -= 1;
  //console.log(cart);
  const thisRow = document.getElementById(product_name);
  rmQtyRow(thisRow);
  const total = calcTotal();
  const total_money = document.getElementById("total_money");
  total_money.innerHTML = "Total: $" + formatNumbers(total);
}

/**
 * Actualizar tabla al agregar cantidad a un producto
 * @param {*} row
 */
function addQtyRow(row) {
  const qty = parseInt(row.cells.item(1).innerHTML);
  row.cells.item(1).innerHTML = qty + 1;
  row.cells.item(4).innerHTML = formatNumbers(
    parseFloat(row.cells.item(3).innerHTML) * (qty + 1)
  );
}

/**
 * Actualizar tabla al dimsinuir cantidad a un producto
 * @param {*} row
 */
function rmQtyRow(row) {
  const qty = parseInt(row.cells.item(1).innerHTML);
  row.cells.item(1).innerHTML = qty - 1;
  row.cells.item(4).innerHTML = formatNumbers(
    parseFloat(row.cells.item(3).innerHTML) * (qty - 1)
  );
}

/**
 * Calcular el total de la orden
 * @returns calcula el total
 */
function calcTotal() {
  var total = 0;
  for (const [key, value] of Object.entries(cart)) {
    const price = value["product"]["price"];
    const qty = value["qty"];
    total += price * qty;
  }
  return total;
}

/**
 * Confirmar orden
 */
function confirmOrder() {
  var listado = [];
  var i = 1;
  for (const [key, value] of Object.entries(cart)) {
    var objeto = {};
    objeto["item"] = i;
    objeto["quantity"] = value["qty"];
    objeto["description"] = key;
    objeto["unitPrice"] = value["product"]["price"];
    i += 1;
    listado.push(objeto);
  }
  console.log(listado);
}

/**
 * Cancelar orden
 * @param {} element
 */
function cancelOrder(element) {
  if (element) {
    //console.log(element);
    cart = {};
    goToCart();
    items = amountOfItems();
    cart_items.innerHTML = items + " items";
  }
}

/**
 * Numeros con dos decimales
 * @param {*} num
 * @returns
 */
function formatNumbers(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}
