// Verificar estado de sesión y mostrar usuario activo
function verificarEstadoSesionAdmin() {
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

function cerrarSesionAdmin() {
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
  setTimeout(() => toast.remove(), 3000);
}

// Cargar y renderizar usuarios desde localStorage
function cargarUsuariosAdmin() {
  const usuarios = JSON.parse(localStorage.getItem('usuariosBinary')) || [];
  const tbody = document.getElementById('usuarios-table-body');
  const badge = document.getElementById('user-count-badge');
  
  tbody.innerHTML = '';
  badge.innerText = `${usuarios.length} Registrados`;

  if (usuarios.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No hay usuarios registrados.</td></tr>`;
    return;
  }

  usuarios.forEach((u) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>@${u.usuario}</strong></td>
      <td>${u.nombre || 'N/A'}</td>
      <td><span style="color: var(--accent); font-weight: 600;">${u.rol}</span></td>
      <td>${u.direccion || 'No especificada'}</td>
      <td>
        <button class="btn btn-danger" onclick="eliminarUsuario('${u.usuario}')">🗑️ Eliminar Perfil</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Eliminar un perfil de usuario
function eliminarUsuario(username) {
  if (!confirm(`¿Estás seguro de eliminar el perfil del usuario @${username}?`)) return;

  let usuarios = JSON.parse(localStorage.getItem('usuariosBinary')) || [];
  usuarios = usuarios.filter(u => u.usuario !== username);
  
  localStorage.setItem('usuariosBinary', JSON.stringify(usuarios));
  showToast(`Perfil de @${username} eliminado correctamente.`);
  cargarUsuariosAdmin();
}

// Cargar y renderizar publicaciones/productos desde localStorage
function cargarProductosAdmin() {
  let productos = JSON.parse(localStorage.getItem('misProductos')) || [
    { id: 'PROD-7821', nombre: 'Silla Gamer Ergonómica Premium', precio: 189.99 },
    { id: 'PROD-3409', nombre: 'Lámpara LED Smart Escritorio', precio: 34.50 }
  ];

  const tbody = document.getElementById('productos-table-body');
  const badge = document.getElementById('prod-count-badge');

  tbody.innerHTML = '';
  badge.innerText = `${productos.length} Publicadas`;

  if (productos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No hay publicaciones activas.</td></tr>`;
    return;
  }

  productos.forEach((p, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family: monospace; color: var(--accent);">${p.id || 'PROD-' + (index + 100)}</td>
      <td><strong>${p.nombre || p.name}</strong></td>
      <td>$${Number(p.precio || p.price).toFixed(2)}</td>
      <td>
        <button class="btn btn-danger" onclick="eliminarPublicacion(${index})">🗑️ Eliminar Publicación</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Eliminar una publicación
function eliminarPublicacion(index) {
  let productos = JSON.parse(localStorage.getItem('misProductos')) || [
    { id: 'PROD-7821', nombre: 'Silla Gamer Ergonómica Premium', precio: 189.99 },
    { id: 'PROD-3409', nombre: 'Lámpara LED Smart Escritorio', precio: 34.50 }
  ];

  const productoEliminado = productos[index];
  productos.splice(index, 1);

  localStorage.setItem('misProductos', JSON.stringify(productos));
  showToast(`Publicación "${productoEliminado.nombre || productoEliminado.name}" eliminada con éxito.`);
  cargarProductosAdmin();
}

// Inicialización al cargar la página
verificarEstadoSesionAdmin();
cargarUsuariosAdmin();
cargarProductosAdmin();