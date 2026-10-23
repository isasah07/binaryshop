let rolSeleccionado = 'Comprador';

function inicializarUsuarios() {
  if (!localStorage.getItem('usuariosBinary')) {
    const precargados = [
      { usuario: 'comprador', pass: '1234', rol: 'Comprador', nombre: 'Juan Pérez', direccion: 'Calle Sur 123', banco: 'ES123456789' },
      { usuario: 'vendedor', pass: '1234', rol: 'Vendedor', nombre: 'Carlos Vende', direccion: 'Av. Norte 456', banco: 'ES987654321' },
      { usuario: 'admin', pass: '1234', rol: 'Administrador', nombre: 'Admin Master', direccion: 'Oficina Central', banco: 'N/A' }
    ];
    localStorage.setItem('usuariosBinary', JSON.stringify(precargados));
  }
}

function verificarEstadoSesion() {
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
  const headerStatus = document.getElementById('header-user-status');

  if (usuarioActivo) {
    document.getElementById('header-user-name').innerText = `@${usuarioActivo.usuario} (${usuarioActivo.rol})`;
    document.getElementById('header-avatar').innerText = usuarioActivo.usuario.charAt(0).toUpperCase();
    headerStatus.classList.remove('hidden');
  } else {
    headerStatus.classList.add('hidden');
  }
}

function cerrarSesion() {
  localStorage.removeItem('usuarioActivo');
  verificarEstadoSesion();
  showToast('Sesión cerrada correctamente.');
  mostrarVista('role-select');
}

inicializarUsuarios();

function mostrarVista(vista) {
  document.getElementById('view-role-select').classList.add('hidden');
  document.getElementById('view-login').classList.add('hidden');
  document.getElementById('view-register').classList.add('hidden');

  if (vista === 'role-select') {
    document.getElementById('view-role-select').classList.remove('hidden');
  } else if (vista === 'login') {
    document.getElementById('view-login').classList.remove('hidden');
  } else if (vista === 'register') {
    document.getElementById('view-register').classList.remove('hidden');
  }
}

function seleccionarRol(rol) {
  rolSeleccionado = rol;
  document.getElementById('login-title').innerText = `Iniciar Sesión como ${rol}`;
  document.getElementById('login-subtitle').innerText = `Accede con tu cuenta de ${rol.toLowerCase()}`;
  mostrarVista('login');
}

function showToast(msg, isError = false) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  if (isError) {
    toast.style.borderColor = 'var(--danger)';
    toast.innerHTML = `<span>❌</span> <span>${msg}</span>`;
  } else {
    toast.innerHTML = `<span>✅</span> <span>${msg}</span>`;
  }
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function handleLogin(e) {
  e.preventDefault();
  const usuarioInput = document.getElementById('login-user').value.trim();
  const passInput = document.getElementById('login-pass').value.trim();

  const usuarios = JSON.parse(localStorage.getItem('usuariosBinary')) || [];

  const usuarioEncontrado = usuarios.find(u => 
    u.usuario === usuarioInput && 
    u.pass === passInput && 
    (u.rol === rolSeleccionado || (rolSeleccionado === 'Vendedor' && u.rol === 'Vendedor'))
  );

  if (!usuarioEncontrado) {
    showToast('Credenciales incorrectas o usuario no registrado para este rol.', true);
    return;
  }

  localStorage.setItem('usuarioActivo', JSON.stringify({ usuario: usuarioEncontrado.usuario, rol: usuarioEncontrado.rol }));
  verificarEstadoSesion();
  showToast(`¡Bienvenido de nuevo, ${usuarioEncontrado.usuario} (${usuarioEncontrado.rol})!`);

  setTimeout(() => {
    if (usuarioEncontrado.rol === 'Comprador') {
      window.location.href = '../catalogo/catalogo.html';
    } else if (usuarioEncontrado.rol === 'Vendedor') {
      window.location.href = '../vendedor/Vendedor.html';
    } else if (usuarioEncontrado.rol === 'Administrador') {
      window.location.href = '../administrador/administrador.html';
    }
  }, 800);
}

function handleRegister(e) {
  e.preventDefault();
  const nombre = document.getElementById('reg-nombre').value.trim();
  const apellido = document.getElementById('reg-apellido').value.trim();
  const direccion = document.getElementById('reg-direccion').value.trim();
  const usuario = document.getElementById('reg-user').value.trim();
  const pass = document.getElementById('reg-pass').value.trim();
  const banco = document.getElementById('reg-banco').value.trim();
  const rol = document.getElementById('reg-rol').value;

  let usuarios = JSON.parse(localStorage.getItem('usuariosBinary')) || [];

  const indexExistente = usuarios.findIndex(u => u.usuario === usuario);

  if (indexExistente !== -1) {
    usuarios[indexExistente].nombre = `${nombre} ${apellido}`;
    usuarios[indexExistente].direccion = direccion;
    usuarios[indexExistente].banco = banco;
    usuarios[indexExistente].pass = pass;
    usuarios[indexExistente].rol = rol;

    localStorage.setItem('usuariosBinary', JSON.stringify(usuarios));
    showToast(`¡Cuenta actualizada con éxito! Por favor inicia sesión.`);
  } else {
    const nuevoUsuario = { 
      usuario, 
      pass, 
      rol, 
      nombre: `${nombre} ${apellido}`, 
      direccion, 
      banco 
    };
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuariosBinary', JSON.stringify(usuarios));
    showToast(`¡Cuenta registrada con éxito! Por favor inicia sesión.`);
  }

  // Nos aseguramos de limpiar cualquier sesión activa previa
  localStorage.removeItem('usuarioActivo');
  verificarEstadoSesion();

  // Redirigimos al formulario de inicio de sesión rellenando el usuario automáticamente
  setTimeout(() => {
    rolSeleccionado = rol;
    document.getElementById('login-title').innerText = `Iniciar Sesión como ${rol}`;
    document.getElementById('login-subtitle').innerText = `Accede con tu cuenta recién creada`;
    document.getElementById('login-user').value = usuario;
    document.getElementById('login-pass').value = '';
    mostrarVista('login');
  }, 1200);
}

// Comprobar estado de sesión al cargar la página
verificarEstadoSesion();