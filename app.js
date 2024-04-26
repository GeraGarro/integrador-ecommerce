const express= require('express')
var translate = require('node-google-translate-skidz')
const fs = require('fs');
const cors = require('cors');
const app=express()

/* app.use(express.static('./public')) */
app.use(express.static('./public'))

/* const bodyParser = require('body-parser'); */
app.use(express.json());
app.use(cors());
const axios = require('axios');

async function obtenerProductos() {
    try {
      const respuesta = await axios.get('https://fakestoreapi.com/products');
      const productos = respuesta.data;
      const productosTraducidos = [];

      // Usa un ciclo con promesas para manejar las traducciones secuencialmente
      for (const producto of productos) {
        const traduccionTitulo = await translate({
          text: producto.title,
          source: 'en',
          target: 'es'
        });
  
        const traducciónCategoria= await translate({
            text:producto.category,
            source: 'en',
            target: 'es'
        })
        const traducciónDescripcion= await translate({
            text:producto.description,
            source: 'en',
            target: 'es'
        })
        const tituloNuevo = traduccionTitulo.translation;
        const categoriaNuevo=traducciónCategoria.translation;
        const descripcionNuevo=traducciónDescripcion.translation;
        productosTraducidos.push({ ...producto, title: tituloNuevo, category: categoriaNuevo, description:descripcionNuevo}); 
      }
  
      return productosTraducidos;
    } catch (error) {
      console.error(error);
      return []; // Devolver un arreglo vacío en caso de errores
    }
  }

  app.get('/productos', async (req, res) => {
    try {
        const productosTraducidos = await obtenerProductos();
        res.json(productosTraducidos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al obtener productos' }); // Enviar una respuesta de error
    }
  });


  async function obtenerDescuentosLocales() {
    try {
        const descuentosData = await fs.promises.readFile('./descuento.json');
        const descuentos = JSON.parse(descuentosData);
        return descuentos;
    } catch (error) {
        console.error(error);
        return []; // Devolver un arreglo vacío en caso de errores
    }
}

  app.get('/descuento', async (req, res) => {
    try {
      const descuentosLocales = await obtenerDescuentosLocales();
      res.json(descuentosLocales);
      console.log(descuentosLocales)
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al obtener descuentos' });
    }
  });
// Función para guardar los productos en el archivo carrito.json
async function guardarEnCarrito(productos) {
  try {
      // Convertir el array de productos a formato JSON
      const productosJSON = JSON.stringify(productos, null, 2);
      // Guardar los productos en el archivo carrito.json
      await fs.promises.writeFile('./carrito.json', productosJSON);
      console.log('Productos guardados en el carrito.');
  } catch (error) {
      console.error(error);
  }
}

async function obtenerCarrito() {
  try {
    const carritoData = await fs.promises.readFile('./carrito.json');
    const carrito = JSON.parse(carritoData);
    return carrito;
  } catch (error) {
    console.error(error);
    return []; // Devolver un arreglo vacío en caso de errores
  }
}

// Ruta para agregar productos al carrito
app.post('/agregarAlCarrito', async (req, res) => {
  try {
    console.log("Entré al servidor por Post");
    // Obtener los productos del cuerpo de la solicitud
    let productos = req.body;
    console.log(productos);

    // Obtener los productos actuales del carrito
    let carrito = await obtenerCarrito();

    // Agregar los nuevos productos al carrito
    carrito = carrito.concat(productos);

    // Guardar el carrito actualizado en carrito.json
    await guardarEnCarrito(carrito);

    res.status(200).json({ mensaje: 'Productos agregados al carrito exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en la recepción en el servidor para agregar productos al carrito.' });  
  }
});


// Función para obtener los productos del carrito desde el archivo carrito.json
async function obtenerCarrito() {
  try {
    const carritoData = await fs.promises.readFile('./carrito.json');
    const carrito = JSON.parse(carritoData);
    return carrito;
  } catch (error) {
    console.error(error);
    return []; // Devolver un arreglo vacío en caso de errores
  }
}

// Ruta para obtener los elementos del carrito
app.get('/carrito', async (req, res) => {
  try {
    const carrito = await obtenerCarrito();
    res.json(carrito);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener elementos del carrito' });
  }
});


app.listen(3000)

console.log("hola")
