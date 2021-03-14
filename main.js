const dataURL = "'data.json'";

const category_list = document.getElementById("category-list");
const product_list = document.getElementById("product-list");
const cart_items = document.getElementById("cart-items");
const page_title = document.getElementById("page-title");

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
  });

function viewProducts(category, products) {
  var html = "";
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
  items = parseInt(cart_items.innerHTML[0]) + 1;
  cart_items.innerHTML = items + " items";
}
