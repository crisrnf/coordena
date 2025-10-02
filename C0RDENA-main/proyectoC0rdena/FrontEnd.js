// frontend.js

const views = document.querySelectorAll('.view');
const menuItems = document.querySelectorAll('.menu li');

const selectCourse = document.getElementById('select-course');
const selectDate = document.getElementById('select-date');
const attendanceBody = document.getElementById('attendance-body');
const saveBtn = document.getElementById('save-attendance');
const clearBtn = document.getElementById('clear-attendance');
const feedback = document.getElementById('save-feedback');

const cocinaDate = document.getElementById('cocina-date');
const cocinaCurso = document.getElementById('cocina-curso');
const cocinaTotal = document.getElementById('cocina-total');
const cocinaCicloB = document.getElementById('cocina-ciclo-b');
const cocinaCicloS = document.getElementById('cocina-ciclo-s');
const cocinaList = document.getElementById('cocina-list');

const histFrom = document.getElementById('hist-from');
const histTo = document.getElementById('hist-to');
const histCurso = document.getElementById('hist-curso');
const histAlumno = document.getElementById('hist-alumno');
const histSearch = document.getElementById('hist-search');
const histResults = document.getElementById('hist-results');

const userNameElem = document.getElementById('user-name');
const userRoleElem = document.getElementById('user-role');
const menuAdmin = document.getElementById('menu-admin');

let currentUser = { name: 'Invitado', role: null, token: null, email: null };

document.addEventListener('DOMContentLoaded', () => {
  setupMenu();
  selectDate.value = new Date().toISOString().split('T')[0];
  cocinaDate.value = selectDate.value;
  loadCursos();
  saveBtn.addEventListener('click', saveAttendance);
  clearBtn.addEventListener('click', () => {
    attendanceBody.innerHTML = '';
    showFeedback('Campos limpiados', 'success');
  });
  menuItems.forEach(mi => {
    mi.addEventListener('click', () => {
      menuItems.forEach(m => m.classList.remove('active'));
      mi.classList.add('active');
      showView(mi.dataset.view);
    });
  });
});

function setupMenu() {
  // Aquí se podría ocultar elementos según rol, una vez que currentUser se establezca
  // Ejemplo:
  if (currentUser.role === 'Coordinador' || currentUser.role === 'Directivo') {
    menuAdmin.style.display = 'block';
  } else {
    menuAdmin.style.display = 'none';
  }
}

function showView(name) {
  views.forEach(v => v.classList.remove('active'));
  const v = document.getElementById('view-' + name);
  if (v) v.classList.add('active');

  if (name === 'marcar') {
    loadAlumnosForCourse();
  } else if (name === 'cocina') {
    loadCocinaView();
  } else if (name === 'historial') {
    // puedes precargar algo o limpiar
    histResults.innerHTML = '';
  }
}

function loadCursos() {
  // Usar fetch desde backend: GET /cursos
  // Aquí un ejemplo simulado:
  const cursos = [
    { id: 1, name: '3°A' },
    { id: 2, name: '3°B' },
    { id: 3, name: '4°A' }
  ];
  selectCourse.innerHTML = cursos.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  cocinaCurso.innerHTML = `<option value="">Todos</option>` + cursos.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  histCurso.innerHTML = `<option value="">Todos</option>` + cursos.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

async function loadAlumnosForCourse() {
  const cursoId = selectCourse.value;
  const fecha = selectDate.value;
  attendanceBody.innerHTML = `<tr><td colspan="5">Cargando...</td></tr>`;
  try {
    const resp = await fetch(`/alumnos?curso_id=${cursoId}&fecha=${fecha}`);
    if (!resp.ok) throw new Error('Error trayendo alumnos');
    const alumnos = await resp.json(); // [{id, nombre, dni, estado?, nota?}, ...]
    if (!Array.isArray(alumnos) || alumnos.length === 0) {
      attendanceBody.innerHTML = `<tr><td colspan="5">No hay alumnos para este curso o fecha</td></tr>`;
      return;
    }
    attendanceBody.innerHTML = alumnos.map((a, idx) => {
      const nota = a.nota || '';
      return `
        <tr data-id="${a.id}">
          <td>${idx + 1}</td>
          <td>${a.nombre}</td>
          <td>${a.dni || ''}</td>
          <td>
            <div class="status-group">
              <button class="status-btn" data-status="present">Presente</button>
              <button class="status-btn" data-status="absent">Ausente</button>
              <button class="status-btn" data-status="justified">Justificado</button>
              <button class="status-btn" data-status="late">Llegó tarde</button>
            </div>
          </td>
          <td><input maxlength="100" class="note-input" value="${nota}"></td>
        </tr>
      `;
    }).join('');

    // Marcar botones ya seleccionados si hay estado previo
    attendanceBody.querySelectorAll('tr').forEach(row => {
      const estado = row.dataset.estado; // si backend retornó estado
      if (estado) {
        const btn = row.querySelector(`.status-btn[data-status="${estado}"]`);
        if (btn) btn.classList.add('active');
      }
      // listeners
      row.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const sibs = btn.parentElement.querySelectorAll('.status-btn');
          sibs.forEach(s => s.classList.remove('active'));
          btn.classList.add('active');
        });
      });
    });
  } catch (err) {
    console.error(err);
    attendanceBody.innerHTML = `<tr><td colspan="5">Error al cargar alumnos</td></tr>`;
  }
}

async function saveAttendance() {
  const cursoId = selectCourse.value;
  const fecha = selectDate.value;
  const rows = Array.from(attendanceBody.querySelectorAll('tr[data-id]'));
  if (rows.length === 0) {
    showFeedback('No hay datos para guardar', 'error');
    return;
  }
  const asistencias = rows.map(r => {
    const id = r.dataset.id;
    const btn = r.querySelector('.status-btn.active');
    const estado = btn ? btn.dataset.status : 'absent';
    const nota = r.querySelector('.note-input').value || '';
    return { alumno_id: id, estado, nota: nota.slice(0, 100) };
  });

  const payload = {
    // acorde con tu endpoint /marcar-lista
    cocinaToken: 'token_cocina_front',
    docenteToken: currentUser.token || '',
    docenteEmail: currentUser.email || '',
    curso_id: cursoId,
    fecha,
    asistencias
  };

  try {
    const resp = await fetch('/marcar-lista', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (resp.ok) {
      showFeedback('Asistencia guardada y notificaciones enviadas', 'success');
    } else {
      const text = await resp.text();
      showFeedback('Error guardando: ' + text, 'error');
    }
  } catch (err) {
    console.error(err);
    showFeedback('Error de conexión', 'error');
  }
}

function showFeedback(msg, type) {
  feedback.textContent = msg;
  feedback.className = `feedback ${type}`;
  setTimeout(() => {
    feedback.className = 'feedback';
    feedback.textContent = '';
  }, 5000);
}

async function loadCocinaView() {
  const fecha = cocinaDate.value;
  const cursoId = cocinaCurso.value;
  try {
    const resp = await fetch(`/cocina?fecha=${fecha}&curso_id=${cursoId}`);
    if (!resp.ok) throw new Error('Error en cocina');
    const data = await resp.json(); 
    // Esperamos algo como:
    // { total: 120, ciclo_b: 70, ciclo_s: 50, lista: [ { nombre, estado, curso }, ... ] }

    cocinaTotal.textContent = data.total ?? '—';
    cocinaCicloB.textContent = data.ciclo_b ?? '—';
    cocinaCicloS.textContent = data.ciclo_s ?? '—';

    if (Array.isArray(data.lista)) {
      cocinaList.innerHTML = data.lista.map(item => `
        <div>${item.nombre} — ${item.curso} — ${item.estado}</div>
      `).join('');
    } else {
      cocinaList.innerHTML = 'No hay datos';
    }
  } catch (err) {
    console.error(err);
    cocinaList.innerHTML = 'Error cargando datos';
  }
}
