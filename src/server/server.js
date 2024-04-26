const axios = require('axios');

async function obtenerProductos() {
  try {
    const respuesta = await axios.get('https://fakestoreapi.com/products');
    const productos = respuesta.data;
    return productos;
  } catch (error) {
    console.error(error);
    return [];
  }
}

module.exports={
    obtenerProductos
}