function cargarCarrito() {
  let carrito = JSON.parse(localStorage.getItem('carritoBinary')) || [];
  let listaHtml = document.getElementById('lista-carrito');
  let totalSpan = document.getElementById('total-pagar');
  let conteoSpan = document.getElementById('conteo-productos');
  
  listaHtml.innerHTML = '';
  let total = 0;
  let conteoTotal = 0;

  if (carrito.length === 0) {
    listaHtml.innerHTML = '<li style="color: var(--text-muted); width: 100%; text-align: center;">El carrito está vacío.</li>';
    if (totalSpan) totalSpan.innerText = '0.00';
    if (conteoSpan) conteoSpan.innerText = '0';
    return;
  }

  // Agrupamos los productos en el carrito por su ID
  let productosAgrupados = {};
  for (let i = 0; i < carrito.length; i++) {
    let p = carrito[i];
    let key = String(p.id);
    
    if (productosAgrupados[key]) {
      productosAgrupados[key].cantidad++;
    } else {
      productosAgrupados[key] = {
        id: p.id,
        nombre: p.nombre || p.name,
        precio: Number(p.precio || p.price),
        cantidad: 1
      };
    }
  }

  for (let key in productosAgrupados) {
    let item = productosAgrupados[key];
    let subtotal = item.precio * item.cantidad;
    total += subtotal;
    conteoTotal += item.cantidad;

    let li = document.createElement('li');
    li.innerHTML = `
      <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 700; font-size: 1rem;">${item.nombre}</span>
        <span style="color: var(--text-muted); font-size: 0.85rem;">$${item.precio.toFixed(2)} c/u</span>
      </div>
      <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.25rem;">
        <div class="acciones-item">
          <button onclick="cambiarCantidad('${item.id}', -1)">-</button>
          <span style="font-weight: 700; padding: 0 0.5rem;">${item.cantidad}</span>
          <button onclick="cambiarCantidad('${item.id}', 1)">+</button>
        </div>
        <span style="color: var(--accent); font-weight: 700;">Subtotal: $${subtotal.toFixed(2)}</span>
        <button class="btn-eliminar" onclick="eliminarItem('${item.id}')">Eliminar</button>
      </div>
    `;
    listaHtml.appendChild(li);
  }

  if (totalSpan) totalSpan.innerText = total.toFixed(2);
  if (conteoSpan) conteoSpan.innerText = conteoTotal;
}

function cambiarCantidad(idProducto, cambio) {
  let carrito = JSON.parse(localStorage.getItem('carritoBinary')) || [];
  
  if (cambio === 1) {
    let productoEncontrado = carrito.find(item => String(item.id) === String(idProducto));
    if (productoEncontrado) {
      carrito.push(productoEncontrado);
    }
  } else if (cambio === -1) {
    let index = carrito.findIndex(item => String(item.id) === String(idProducto));
    if (index !== -1) {
      carrito.splice(index, 1);
    }
  }

  localStorage.setItem('carritoBinary', JSON.stringify(carrito));
  cargarCarrito();
  if (typeof actualizarContadorCarrito === 'function') {
    actualizarContadorCarrito();
  }
}

function eliminarItem(idProducto) {
  let carrito = JSON.parse(localStorage.getItem('carritoBinary')) || [];
  let nuevoCarrito = carrito.filter(item => String(item.id) !== String(idProducto));

  localStorage.setItem('carritoBinary', JSON.stringify(nuevoCarrito));
  cargarCarrito();
  if (typeof actualizarContadorCarrito === 'function') {
    actualizarContadorCarrito();
  }
}

function procesarPago() {
  let carrito = JSON.parse(localStorage.getItem('carritoBinary')) || [];
  if (carrito.length === 0) {
    alert("No hay productos en el carrito para procesar el pago.");
    return;
  }

  let inputDireccion = document.getElementById('input-direccion');
  let direccion = inputDireccion ? inputDireccion.value.trim() : '';
  
  if (direccion === "") {
    alert("Por favor, ingresa una dirección de envío.");
    return;
  }

  let confirmar = confirm("¿Confirma que desea enviar su pedido a la dirección: " + direccion + "?");

  if (confirmar) {
    alert("¡Compra procesada con éxito! Su pedido va en camino.");
    localStorage.removeItem('carritoBinary');
    if (inputDireccion) inputDireccion.value = "";
    cargarCarrito();
  }
}

function verificarEstadoSesionCarrito() {
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

function cerrarSesionCarrito() {
  localStorage.removeItem('usuarioActivo');
  window.location.href = '../inicio/index.html';
}

// Inicialización al cargar la página
verificarEstadoSesionCarrito();
cargarCarrito();