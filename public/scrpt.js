
function truncateText(texto, cantidadMaxima) {
    if (texto.length <= cantidadMaxima) {
      return texto;
    }
  
    return texto.substring(0, cantidadMaxima) + "...";
  }

(()=>{
    const $contenedorPrincipal=document.getElementById("contenedor-Principal"),
    $fragment=document.createDocumentFragment();



    // Función para enviar el producto al servidor
  async function enviarProductoAlServidor(producto) {
    try {
      console.log(producto)
      const response = await fetch("http://localhost:3000/agregarAlCarrito", {
      
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(producto)
      });

      if (response.ok) {
        alert('¡Producto agregado al carrito!');
      } else {
        throw new Error('Error al agregar el producto al carrito.');
      }
    } catch (error) {
      console.error(error);
      alert('Error al agregar al comunicarse con el servidor.');
    }
  }


    async function getProducts(){
        try{
            let res=await fetch("http://localhost:3000/productos");
            let resDescuentos = await fetch("http://localhost:3000/descuento"); 

            if(!res.ok || !resDescuentos.ok) {
              throw {
                  status: res.status || resDescuentos.status,
                  statusText: res.statusText || resDescuentos.statusText
              };
          }

            let json=await res.json();
            let descuentosJson = await resDescuentos.json(); // Convertir la respuesta de descuentos a JSON
            console.log(json, descuentosJson);


            
      json.forEach((el)=>{

         
        

        const $contenedor=document.createElement("div");
        $contenedor.classList.add("contenedor");
        const $title= document.createElement("h4");
        $title.innerHTML =`${el.title}`;
        $title.classList.add("titulo");
        $contenedor.appendChild($title);

        const $category=document.createElement("p");
        $category.innerHTML=`${el.category}`;
        $category.classList.add("texto-categoria")
        $contenedor.appendChild($category);


        const $ContenedorImagen=document.createElement("figure");
        $ContenedorImagen.classList.add("contenedor-imagen")
        const $imagen=document.createElement("img")
        $imagen.classList.add("imagen")
        $imagen.src=el.image;
        $ContenedorImagen.appendChild($imagen)
        $contenedor.appendChild($ContenedorImagen)


        const $caraAtras = document.createElement("div"); // Cara posterior
        $caraAtras.classList.add("cara-atras");
        const $descripcion= document.createElement("p");
        const descripcionCortada = truncateText(el.description, 50);
        $descripcion.innerHTML=descripcionCortada;
        $descripcion.classList.add("descripcion");
       
       
        const $descripcionCompleta = document.createElement("span");
        $descripcionCompleta.classList.add("tooltip");
        $descripcionCompleta.innerHTML = el.description; // Descripción completa
        $descripcionCompleta.style.display = "none"; // Initially hide the tooltip

        // **Event to show tooltip on mouseover**
        $contenedor.addEventListener("mouseover", function () {
          $category.style.display="none";
          $ContenedorImagen.style.display="none";
          $descripcion.style.display="none";
          $descripcionCompleta.style.display = "block"; // Show the tooltip
        });

        // **Event to hide tooltip on mouseout**
        $contenedor.addEventListener("mouseout", function () {
          $category.style.display="block";
          $ContenedorImagen.style.display="block";
          $descripcionCompleta.style.display = "none"; 
          $descripcion.style.display="block"
        });

       


        $caraAtras.appendChild($descripcion);
        $caraAtras.appendChild($descripcionCompleta);
        $contenedor.appendChild($caraAtras); 

        $contenedorPrecioCompra=document.createElement("div")
        const $price=document.createElement("p");
        $price.innerHTML=`$${el.price}`;
        $price.classList.add("precio");
        $contenedorPrecioCompra.appendChild($price);
        
    
       const $boton=document.createElement("button")
       $boton.classList.add("boton")
       $boton.innerText="Comprar";

       $contenedorPrecioCompra.appendChild($boton)
        $contenedorPrecioCompra.classList.add("contenedor-Precio-Compra")

       $contenedor.appendChild($contenedorPrecioCompra)

       const descuento = descuentosJson.find((descuento) => descuento.id === el.id);

       if(descuento){
        const $cartelOferta=document.createElement("div");
        const $cartel=document.createElement("p");
        $cartel.classList.add("texto-oferta");
        $cartel.innerHTML=`Descuento del ${descuento.porcentaje}%`;
        $cartelOferta.appendChild($cartel);
        $cartelOferta.classList.add("contenedor-oferta");
        $ContenedorImagen.appendChild($cartelOferta);
        $price.classList.add("textoTachado");
        el.price=(el.price-(el.price*descuento.porcentaje/100)).toFixed(2);
       

        const $precioDescuento=document.createElement("p");
        $precioDescuento.innerHTML=`$${el.price}`;
        $precioDescuento.classList.add("precio");
        $precioDescuento.classList.add("precioOferta");
        $contenedorPrecioCompra.appendChild($precioDescuento);
        $precioDescuento.style.background="red";
        $precioDescuento.style.color="white"
       }
      
       $boton.addEventListener("click", function () {
        // Crear objeto con los datos del producto
        const producto = {
            title: el.title,
            price: el.price,
            image: el.image
        };

        // Enviar el producto al servidor
        enviarProductoAlServidor(producto);
    });

       $fragment.appendChild($contenedor)
      })
      $contenedorPrincipal.appendChild($fragment);
        }
        catch(err){
            let message=err.statusText || "Error al cargar";
            
            $contenedorPrincipal.innerHTML=`Error ${err.status} : ${message}`
        }
    }

    getProducts();
})();






