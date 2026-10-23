let currentSelectedProduct = null;
let productsList = JSON.parse(localStorage.getItem('misProductos')) || [
  {
    id: 'PROD-7821',
    name: 'Silla Gamer Ergonómica Premium',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=600&q=80',
    desc: 'Silla ergonómica reclinable con soporte lumbar y reposabrazos 4D.'
  },
  {
    id: 'PROD-3409',
    name: 'Lámpara LED Smart Escritorio',
    price: 34.50,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    desc: 'Lámpara inteligente con control de temperatura de color e integración de voz.'
  }
];

// Verificar sesión y mostrar usuario activo
function verificarEstadoSesionVendedor() {
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

function cerrarSesionVendedor() {
  localStorage.removeItem('usuarioActivo');
  window.location.href = '../inicio/index.html';
}

// Notificaciones emergentes (Toasts)
function showToast(msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✅</span> <span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// Guardar productos en localStorage para sincronizar con el catálogo
function guardarProductosStorage() {
  localStorage.setItem('misProductos', JSON.stringify(productsList));
}

// Renderizar tarjetas de Publicaciones Activas
function renderActiveProducts() {
  const grid = document.getElementById('active-products-grid');
  const badge = document.getElementById('active-badge');
  grid.innerHTML = '';
  badge.innerText = `${productsList.length} Publicaciones`;

  if (productsList.length === 0) {
    grid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center; padding: 1rem;">No hay publicaciones activas.</p>`;
    return;
  }

  productsList.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image || product.imagen}" class="product-img" onerror="this.src='https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'">
      <div class="product-body">
        <div style="font-size: 0.7rem; color: var(--accent); font-family: monospace; font-weight: 600;">ID: ${product.id}</div>
        <div style="font-weight: 700; margin-bottom: 0.5rem; font-size: 0.95rem;">${product.name || product.nombre}</div>
        <div style="font-weight: 800; font-size: 1.1rem; margin-bottom: 0.75rem;">$${Number(product.price || product.precio).toFixed(2)}</div>
        <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.5rem;" onclick="viewProductDetails('${product.id}')">Ver detalles</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Abrir/Cerrar Formulario de Publicación
function togglePublishForm() {
  const box = document.getElementById('publish-form-box');
  const icon = document.getElementById('sell-btn-icon');
  const text = document.getElementById('sell-btn-text');

  if (box.classList.contains('hidden')) {
    document.getElementById('edit-prod-id').value = '';
    document.getElementById('form-box-title').innerText = '📦 Formulario de Publicación';
    document.getElementById('submit-pub-btn').innerText = 'Confirmar y Publicar Producto';
    
    box.classList.remove('hidden');
    icon.innerText = '✖';
    text.innerText = 'Cerrar Formulario';
  } else {
    box.classList.add('hidden');
    icon.innerText = '➕';
    text.innerText = 'Publicar producto';
  }
}

// Guardar o Actualizar Publicación
function handlePublishOrUpdate(e) {
  e.preventDefault();
  const editId = document.getElementById('edit-prod-id').value;
  const name = document.getElementById('prod-name').value;
  const price = parseFloat(document.getElementById('prod-price').value);
  const image = document.getElementById('prod-image').value;
  const desc = document.getElementById('prod-desc').value;

  if (editId) {
    const item = productsList.find(p => p.id === editId);
    if (item) {
      item.name = name;
      item.nombre = name;
      item.price = price;
      item.precio = price;
      item.image = image;
      item.imagen = image;
      item.desc = desc;
    }
    showToast(`Publicación "${name}" actualizada con éxito`);
  } else {
    const newId = 'PROD-' + Math.floor(1000 + Math.random() * 9000);
    productsList.unshift({ id: newId, name, nombre: name, price, precio: price, image, imagen: image, desc });
    showToast(`Producto "${name}" publicado con éxito (#${newId})`);
  }

  guardarProductosStorage();
  renderActiveProducts();
  e.target.reset();
  togglePublishForm();
}

// Modal: Ver Detalles
function viewProductDetails(id) {
  currentSelectedProduct = productsList.find(p => p.id === id);
  if (!currentSelectedProduct) return;

  document.getElementById('modal-title').innerText = currentSelectedProduct.name || currentSelectedProduct.nombre;
  document.getElementById('modal-id').innerText = `ID de Registro: ${currentSelectedProduct.id}`;
  document.getElementById('modal-price').innerText = `$${Number(currentSelectedProduct.price || currentSelectedProduct.precio).toFixed(2)}`;
  document.getElementById('modal-desc').innerText = currentSelectedProduct.desc || 'Sin descripción disponible.';
  document.getElementById('modal-img').src = currentSelectedProduct.image || currentSelectedProduct.imagen;

  hideDeleteConfirm();
  document.getElementById('modal-container').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-container').classList.add('hidden');
}

// Modificar Publicación desde el Modal
function startEditingFromModal() {
  if (!currentSelectedProduct) return;

  document.getElementById('edit-prod-id').value = currentSelectedProduct.id;
  document.getElementById('prod-name').value = currentSelectedProduct.name || currentSelectedProduct.nombre;
  document.getElementById('prod-price').value = currentSelectedProduct.price || currentSelectedProduct.precio;
  document.getElementById('prod-image').value = currentSelectedProduct.image || currentSelectedProduct.imagen;
  document.getElementById('prod-desc').value = currentSelectedProduct.desc || '';

  document.getElementById('form-box-title').innerText = '✏️ Editar Publicación';
  document.getElementById('submit-pub-btn').innerText = 'Guardar Cambios de la Publicación';

  closeModal();
  document.getElementById('publish-form-box').classList.remove('hidden');
}

// Eliminar Publicación desde el Modal
function showDeleteConfirm() {
  document.getElementById('modal-delete-confirm').classList.remove('hidden');
}

function hideDeleteConfirm() {
  document.getElementById('modal-delete-confirm').classList.add('hidden');
}

function confirmDeleteProduct() {
  if (!currentSelectedProduct) return;

  const prodId = currentSelectedProduct.id;
  productsList = productsList.filter(p => p.id !== prodId);

  guardarProductosStorage();
  showToast('Notificación: Publicación eliminada con éxito');
  renderActiveProducts();
  closeModal();
}

// Inicialización
verificarEstadoSesionVendedor();
renderActiveProducts();