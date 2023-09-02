class Producto {
  constructor(nombre, tipo, precio = 0, imagen) {
    this.nombre = nombre;
    this.tipo = tipo;
    this.precio = precio;
    this.imagen = imagen;
  }
}

const productos = [
  new Producto('Banana', 'Fruta', 500, './imagenes/banana.jpg'),
  new Producto('Manzana', 'Fruta', 400, './imagenes/manzana.jpg'),
  new Producto('Durazno', 'Fruta', 500, './imagenes/durazno2.jpg'),
  new Producto('Mandarina', 'Fruta', 400, './imagenes/mandarina.png'),
  new Producto('Naranja', 'Fruta', 500, './imagenes/naranja1.jpg'),
  new Producto('Tomate', 'Verdura', 300, './imagenes/tomate.jpg'),
  new Producto('Lechuga', 'Verdura', 350, './imagenes/lechuga.jpg'),
  new Producto('Limon', 'Verdura', 300, './imagenes/limon.jpg'),
  new Producto('Bife', 'Carne', 900, './imagenes/bife.jpg'),
  new Producto('Milanesa', 'Carne', 800, './imagenes/milanesa.jpg'),
  new Producto('Asado', 'Carne', 1500, './imagenes/asado.jpg'),
  new Producto('Pescado', 'Carne', 800, './imagenes/pescado.jpg'),
  new Producto('Hamburguesa', 'Carne', 700, './imagenes/hamburguesa.jpg'),
  

];

const carrito = {
  productos: [],
  agregarProducto: function (producto) {
    this.productos.push(producto);
  },
  calcularTotal: function () {
    return this.productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  }
};


const productosContainer = document.getElementById('productosContainer');
const productosLista = document.getElementById('productosLista');
const carritoContainer = document.getElementById('carritoContainer');
const btnVaciarCarrito = document.getElementById('btnVaciarCarrito');


// agrego la api y transformo mi supermercado en una tienda de iphone
// si comentamos la function obtenerProductosDesdeAPI obtenemos los productos que yo cree
async function obtenerProductosDesdeAPI() {
  try {
    const searchTerm = 'iphone'; // Reemplaza con el término de búsqueda deseado
    const apiUrl = `https://api.mercadolibre.com/sites/MLA/search?q=${encodeURIComponent(searchTerm)}`;

    const respuesta = await fetch(apiUrl);

    if (!respuesta.ok) {
      throw new Error('No se pudo obtener la respuesta de la API.');
    }

    const datos = await respuesta.json();
    return datos.results; // Retorna los resultados de la API
  } catch (error) {
    console.error('Error al obtener datos desde la API de MercadoLibre:', error);
    throw error;
  }
}





function mostrarProductos() {
  productosLista.innerHTML = '';
  productos.forEach(producto => {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-3';
    card.innerHTML = `
      <div class="card">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text">${producto.tipo} - $${producto.precio}</p>
          <button class="btn btn-success btn-agregar" data-producto='${JSON.stringify(producto)}'>Agregar al Carrito</button>
        </div>
      </div>
    `;
    productosLista.appendChild(card);
  });
}

function agregarAlCarrito(producto) {
  const productoExistente = carrito.productos.find(p => p.nombre === producto.nombre);

  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    producto.cantidad = 1;
    carrito.agregarProducto(producto);
  }
  
  mostrarCarrito();

  // Guardamos productos en localStorage después de agregar uno nuevo
  const productosEnCarrito = carrito.productos.map(producto => ({ ...producto }));
  localStorage.setItem('carrito', JSON.stringify(productosEnCarrito));
  Swal.fire({
    title: "Agregado",
    text: `Has Agregado el Producto: ${producto.nombre}`,
    timer: 3000,
    icon: "success",
    confirmButtonText: "Aceptar",
  });
}

function eliminarProducto(index) {
  const productoEliminado = carrito.productos[index];
  carrito.productos.splice(index, 1);
  mostrarCarrito();
  
  // Guardar productos en localStorage después de eliminar uno
  const productosEnCarrito = carrito.productos.map(producto => ({ ...producto }));
  localStorage.setItem('carrito', JSON.stringify(productosEnCarrito));
  
  // Mostrar el nombre del producto eliminado en el mensaje de SweetAlert
  Swal.fire({
    title: "Eliminado",
    text: `Has Eliminado el Producto: ${productoEliminado.nombre}`,
    timer: 3000,
    icon: "error",
    confirmButtonText: "Aceptar",
  });
}

function mostrarCarrito() {
  carritoList.innerHTML = '';
  carrito.productos.forEach((producto, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      ${producto.nombre} - ${producto.tipo} - Cantidad: ${producto.cantidad} - $${producto.precio * producto.cantidad}
      <button class="btn btn-sm btn-danger btn-eliminar" data-index="${index}">Eliminar</button>
    `;
    carritoList.appendChild(li);
  });

  const total = carrito.calcularTotal();
  totalCarrito.textContent = `Total a pagar: $${total}`;
  carritoContainer.style.display = 'block';

  // Guardar productos en localStorage
  const productosEnCarrito = carrito.productos.map(producto => ({ ...producto }));
  localStorage.setItem('carrito', JSON.stringify(productosEnCarrito));

  const btnEliminarProducto = document.querySelectorAll('.btn-eliminar');
  btnEliminarProducto.forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.getAttribute('data-index'));
      eliminarProducto(index);
    });
  });
}






productosContainer.style.display = 'block';

// Inicializar eventos después de cargar los productos
// Aca agrego la Api de Mercado libre tambien
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const productosAPI = await obtenerProductosDesdeAPI();

    // Limpiar la lista de productos actual
    productos.length = 0;

    // Crear productos a partir de los datos de la API y agregarlos a la lista de productos
    productosAPI.forEach(apiProducto => {
      const producto = new Producto(apiProducto.title, 'Electrónica', apiProducto.price, apiProducto.thumbnail);
      productos.push(producto);
    });

    // Mostrar los productos en la página
    mostrarProductos();
  } catch (error) {
    // Manejar el error, por ejemplo, mostrar un mensaje de error en la página
    console.error('Error al cargar productos desde la API de MercadoLibre:', error);
  }
  











  // Restaurar carrito desde localStorage
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito.productos = JSON.parse(carritoGuardado);
    mostrarCarrito();
  }
  
  const btnAgregarCarrito = document.querySelectorAll('.btn-agregar');
  btnAgregarCarrito.forEach(btn => {
    btn.addEventListener('click', () => {
      const producto = JSON.parse(btn.getAttribute('data-producto'));
      agregarAlCarrito(producto);
    });
  });

  const btnEliminarProducto = document.querySelectorAll('.btn-eliminar');
  btnEliminarProducto.forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.getAttribute('data-index'));
      eliminarProducto(index);
    });
  });

  btnVaciarCarrito.addEventListener('click', () => {
    carrito.productos = [];
    mostrarCarrito();
    localStorage.removeItem('carrito');
    Swal.fire({
      title: "Eliminado",
      text: "Has vaciado el Carrito",
      timer: 3000,
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  });
});
mostrarProductos();
productosContainer.style.display = 'block';


