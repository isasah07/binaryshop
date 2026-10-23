// Inicializar productos por defecto en localStorage si no existen o está vacío
if (!localStorage.getItem('misProductos') || JSON.parse(localStorage.getItem('misProductos')).length === 0) {
  const productosIniciales = [
    { id: 1, nombre: 'Laptop Básica', precio: 450, imagen: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80' },
    { id: 2, nombre: 'Mouse Inalámbrico', precio: 15, imagen: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80' },
    { id: 3, nombre: 'Teclado Mecánico', precio: 35, imagen: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80' }
  ];
  localStorage.setItem('misProductos', JSON.stringify(productosIniciales));
}

let productos = JSON.parse(localStorage.getItem('misProductos')) || [];

function mostrarCatalogo(listaAmostrar) {
  let contenedor = document.getElementById('contenedor-productos');
  contenedor.innerHTML = '';

  if (listaAmostrar.length === 0) {
    contenedor.innerHTML = '<p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center;">No se encontraron productos.</p>';
    return;
  }

  for (let i = 0; i < listaAmostrar.length; i++) {
    let p = listaAmostrar[i];
    
    let nombre = p.nombre || p.name;
    let precio = p.precio || p.price;
    let imagen = p.imagen || p.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
    let id = p.id;

    let tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta-producto');
    tarjeta.innerHTML = `
      <img src="${imagen}" alt="${nombre}" onerror="this.src='https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'">
      <h3>${nombre}</h3>
      <p>$${Number(precio).toFixed(2)}</p>
      <button class="btn-carrito" onclick="agregarAlCarrito('${id}')">Añadir al carrito</button><br>
      <button class="btn-comprar" onclick="comprarInmediato('${id}')">Comprar de inmediato</button>
    `;
    contenedor.appendChild(tarjeta);
  }
}

function filtrarProductos() {
  let textoBusqueda = document.getElementById('input-buscar').value.toLowerCase();
  
  let productosFiltrados = [];
  for (let i = 0; i < productos.length; i++) {
    let p = productos[i];
    let nombreProducto = (p.nombre || p.name || '').toLowerCase();
    if (nombreProducto.includes(textoBusqueda)) {
      productosFiltrados.push(p);
    }
  }

  mostrarCatalogo(productosFiltrados);
}

function actualizarContadorCarrito() {
  let carrito = JSON.parse(localStorage.getItem('carritoBinary')) || [];
  let contadorSpan = document.getElementById('contador-carrito');
  if (contadorSpan) {
    contadorSpan.innerText = carrito.length;
  }
}

function agregarAlCarrito(idProducto) {
  let productoEncontrado = null;
  for (let i = 0; i < productos.length; i++) {
    if (String(productos[i].id) === String(idProducto)) {
      productoEncontrado = productos[i];
      break;
    }
  }

  if (productoEncontrado) {
    let carritoActual = JSON.parse(localStorage.getItem('carritoBinary')) || [];
    carritoActual.push({
      id: productoEncontrado.id,
      nombre: productoEncontrado.nombre || productoEncontrado.name,
      precio: productoEncontrado.precio || productoEncontrado.price
    });
    localStorage.setItem('carritoBinary', JSON.stringify(carritoActual));

    actualizarContadorCarrito();
    alert("¡Producto añadido al carrito con éxito!");
  }
}

function comprarInmediato(idProducto) {
  agregarAlCarrito(idProducto);
  window.location.href = "../carrito/carrito.html";
}

function verificarEstadoSesionCatalogo() {
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
  const headerStatus = document.getElementById('header-user-status');

  if (usuarioActivo && headerStatus) {
    document.getElementById('header-user-name').innerText = `@${usuarioActivo.usuario} (${usuarioActivo.rol})`;
    document.getElementById('header-avatar').innerText = usuarioActivo.usuario.charAt(0).toUpperCase();
    headerStatus.classList.remove('hidden');
  } else if (headerStatus) {
    headerStatus.classList.add('hidden');
  }
}

function cerrarSesionCatalogo() {
  localStorage.removeItem('usuarioActivo');
  window.location.href = '../inicio/index.html';
}

// Inicialización al cargar la página
verificarEstadoSesionCatalogo();
mostrarCatalogo(productos);
actualizarContadorCarrito();