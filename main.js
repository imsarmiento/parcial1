const dataURL = "'data.json'";

const category_list = document.getElementById("category-list");

const product_list = document.getElementById("product-list");

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
      li.classList.add("nav-item");
      category_list.appendChild(li);
      const a = document.createElement("a");
      a.classList.add("nav-link", "active");
      a.setAttribute("aria-current", "page");
      a.addEventListener(
        "click",
        function () {
          viewProducts(element["products"]);
        },
        false
      );
      li.appendChild(a);
      const text = document.createTextNode(element["name"]);
      a.appendChild(text);
    });
  });

function viewProducts(products) {
  var html = "";
  products.forEach((product) => {
    console.log(product["name"]);
    html += "<p>" + product["name"] + "</p>";
  });
  product_list.innerHTML = html;
}
