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


        let totalSuma = 0;


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

            totalSuma += parseFloat($precioTotal.textContent);

            const $botonEliminar = document.createElement("button");
            $botonEliminar.innerText = "Eliminar";
            $botonEliminar.classList.add("boton-eliminar");
            $botonEliminar.addEventListener("click", () => eliminarProductoCarrito(el.title)); // Pasar el ID del producto a eliminar
            $itemLista.appendChild($botonEliminar);
        });

        $contenedorPrincipal.appendChild($fragment);

        const $contenedorFinal = document.createElement("div");
        $contenedorFinal.classList.add("contenedor-compraFinal")
        const $totalSumaElement = document.createElement("p");
        $totalSumaElement.classList.add("totalSuma")
        $totalSumaElement.textContent = `$ ${totalSuma.toFixed(2)}`; // Asegurar que el total tenga 2 decimales

        const $botonComprar = document.createElement("button")
        $botonComprar.innerText = "Comprar";
        $botonComprar.classList.add("botonComprar");
        $botonComprar.addEventListener("click", () => enviarCompraAlServidor(totalSuma)); // Pasar totalSuma como parámetro
        $contenedorFinal.appendChild($botonComprar);
        $contenedorFinal.appendChild($totalSumaElement);

        $contenedorPrincipal.parentNode.insertBefore($contenedorFinal, $contenedorPrincipal.nextSibling);

        // Función para actualizar el precio total
        function actualizarPrecioTotal($precioTotalElement, cantidad, precio) {
            const precioTotal = cantidad * precio;
            $precioTotalElement.textContent = precioTotal.toFixed(2); // Asegurar que el precio total tenga 2 decimales
            calcularTotalSuma(); // Llamar a la función para recalcular el total de la suma
        }

        // Función para calcular el total de la suma
        function calcularTotalSuma() {
            totalSuma = 0;
            document.querySelectorAll(".precio-total").forEach(($precioTotalElement) => {
                totalSuma += parseFloat($precioTotalElement.textContent);
            });
            $totalSumaElement.textContent = `Total: ${totalSuma.toFixed(2)}`;
        }
    } catch (err) {
        let message = err.statusText || "Error al cargar";
        $contenedorPrincipal.innerHTML = `Error ${err.status}: ${message}`;
    }
}

async function enviarCompraAlServidor(totalSuma) {
  try {
      let detallesCompra = [];

      document.querySelectorAll(".itemLista").forEach(($itemLista) => {
          const $titulo = $itemLista.querySelector(".titulo");
          const $cantidadInput = $itemLista.querySelector(".cantidad");
          const $precioTotal = $itemLista.querySelector(".precio-total");

          const titulo = $titulo.textContent;
          const cantidad = $cantidadInput.value;
          const precioTotal = $precioTotal.textContent;

          detallesCompra.push({ titulo, cantidad, precioTotal });
      });

      const compraJSON = {
          detalles: detallesCompra,
          totalSuma: totalSuma.toFixed(2) // Utiliza totalSuma recibido como parámetro
      };

      let res = await fetch("http://localhost:3000/compra", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(compraJSON)
      });

      if (!res.ok) {
          throw {
              status: res.status,
              statusText: res.statusText
          };
      }

      // Si la compra se realizó con éxito, muestra un mensaje emergente
      mostrarMensajeExito();

      console.log("Compra realizada con éxito");
  } catch (err) {
      console.error(`Error ${err.status}: ${err.statusText}`);
  }
}

function mostrarMensajeExito() {
  const $mensajeExito = document.createElement("div");
  $mensajeExito.classList.add("mensaje-exito");
  $mensajeExito.textContent = "¡Compra realizada con éxito!";
  
  // Agrega el mensaje al cuerpo del documento
  document.body.appendChild($mensajeExito);

  // Elimina el mensaje después de unos segundos
  setTimeout(() => {
      $mensajeExito.remove();
  }, 3000); // Elimina el mensaje después de 3 segundos (3000 milisegundos)
}

async function eliminarProductoCarrito(title) {
  try {
      let res = await fetch(`http://localhost:3000/carrito/${title}`, {
          method: "DELETE"
      });

      if (!res.ok) {
          throw {
              status: res.status,
              statusText: res.statusText
          };
      }

      // Recargar la página después de eliminar el producto del carrito
      location.reload();
  } catch (err) {
      console.error(`Error ${err.status}: ${err.statusText}`);
  }
}
getProductosCarrito();