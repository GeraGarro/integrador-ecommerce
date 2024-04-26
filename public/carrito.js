const $contenedorPrincipal = document.querySelector(".contenedor-carrito");
const $fragment = document.createDocumentFragment();

async function getProductosCarrito() {
  try {
    let res = await fetch("http://localhost:3000/carrito");

    if (!res.ok) {
      throw {
        status: res.status,
        statusText: res.statusText
      };
    }

    let json = await res.json();

    json.forEach((el) => {
      const $itemLista = document.createElement("li");
      $itemLista.classList.add("itemLista")
      const $imagen = document.createElement("img");
      $imagen.classList.add("imagen");
      $imagen.src = el.image;

      const $titulo = document.createElement("p");
      $titulo.classList.add("titulo");
      $titulo.textContent = el.title;

      const $price = document.createElement("p");
      $price.classList.add("precio");
      $price.textContent = el.price;

      const $cantidadInput = document.createElement("input");
  $cantidadInput.classList.add("cantidad");
  $cantidadInput.type = "number";
  $cantidadInput.value = 1; 
  $cantidadInput.addEventListener("change", () => {
    actualizarPrecioTotal($precioTotal, $cantidadInput.value, el.price);
  });

  const $precioTotal = document.createElement("p");
  $precioTotal.classList.add("precio-total");
  $precioTotal.textContent = el.price; // precio total inicial

      $itemLista.appendChild($imagen);
      $itemLista.appendChild($titulo);
      $itemLista.appendChild($price);
      $itemLista.appendChild($cantidadInput);
      
      $fragment.appendChild($itemLista);
      $itemLista.appendChild($precioTotal);
    });

    $contenedorPrincipal.appendChild($fragment);

    function actualizarPrecioTotal($precioTotalElement, cantidad, precio) {
        const precioTotal = cantidad * precio;
        $precioTotalElement.textContent = precioTotal;
      }
  } catch (err) {
    let message = err.statusText || "Error al cargar";
    $contenedorPrincipal.innerHTML = `Error ${err.status}: ${message}`;
  }
}

getProductosCarrito();