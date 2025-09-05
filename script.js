const addBtn = document.getElementById('addBtn');
const todoBody = document.getElementById('todoBody');

// Cargar tareas guardadas al iniciar
window.addEventListener('DOMContentLoaded', () => {
    const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas.forEach(({ tarea, estado }) => {
        agregarFila(tarea, estado);
    });
});

addBtn.addEventListener('click', () => {
    // Evitar múltiples filas de entrada
    if (document.querySelector('.input-row')) return;

    const row = document.createElement('tr');
    row.classList.add('input-row');
    row.innerHTML = `
        <td>
            <input type="text" placeholder="Nueva tarea">
        </td>
        <td>
            <select>
                <option>Pendiente</option>
                <option>En proceso</option>
                <option>Completada</option>
            </select>
            <button class="confirmBtn" title="Confirmar">✔️</button>
        </td>
    `;
    todoBody.appendChild(row);

    const input = row.querySelector('input');
    const select = row.querySelector('select');
    const confirmBtn = row.querySelector('.confirmBtn');

    // Confirmar con botón
    confirmBtn.addEventListener('click', () => {
        if (input.value.trim() !== '') {
            const tarea = input.value.trim();
            const estado = select.value;
            agregarFila(tarea, estado);
            guardarTarea(tarea, estado);
            row.remove();
        }
    });

    // Confirmar con Enter
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim() !== '') {
            const tarea = this.value.trim();
            const estado = select.value;
            agregarFila(tarea, estado);
            guardarTarea(tarea, estado);
            row.remove();
        }
    });

    input.focus();
});

// Función para agregar una fila a la tabla
function agregarFila(tarea, estado) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${tarea}</td>
        <td>
            ${estado}
            <button class="editBtn" title="Editar">✏️</button>
            <button class="deleteBtn" title="Borrar">🗑️</button>
        </td>
    `;
    todoBody.appendChild(row);

    // Botón borrar
    row.querySelector('.deleteBtn').addEventListener('click', () => {
        borrarTarea(tarea, estado);
        row.remove();
    });

    // Botón editar
    row.querySelector('.editBtn').addEventListener('click', () => {
        editarFila(row, tarea, estado);
    });
}

// Función para editar una fila
function editarFila(row, tarea, estado) {
    row.innerHTML = `
        <td>
            <input type="text" value="${tarea}">
        </td>
        <td>
            <select>
                <option${estado === 'Pendiente' ? ' selected' : ''}>Pendiente</option>
                <option${estado === 'En proceso' ? ' selected' : ''}>En proceso</option>
                <option${estado === 'Completada' ? ' selected' : ''}>Completada</option>
            </select>
            <button class="confirmBtn" title="Confirmar">✔️</button>
            <button class="deleteBtn" title="Borrar">🗑️</button>
        </td>
    `;

    const input = row.querySelector('input');
    const select = row.querySelector('select');
    const confirmBtn = row.querySelector('.confirmBtn');
    const deleteBtn = row.querySelector('.deleteBtn');

    // Confirmar edición
    confirmBtn.addEventListener('click', () => {
        const nuevaTarea = input.value.trim();
        const nuevoEstado = select.value;
        if (nuevaTarea !== '') {
            actualizarTarea(tarea, estado, nuevaTarea, nuevoEstado);
            row.innerHTML = `
                <td>${nuevaTarea}</td>
                <td>
                    ${nuevoEstado}
                    <button class="editBtn" title="Editar">✏️</button>
                    <button class="deleteBtn" title="Borrar">🗑️</button>
                </td>
            `;
            // Reasignar eventos
            row.querySelector('.editBtn').addEventListener('click', () => editarFila(row, nuevaTarea, nuevoEstado));
            row.querySelector('.deleteBtn').addEventListener('click', () => {
                borrarTarea(nuevaTarea, nuevoEstado);
                row.remove();
            });
        }
    });

    // Borrar durante edición
    deleteBtn.addEventListener('click', () => {
        borrarTarea(tarea, estado);
        row.remove();
    });

    input.focus();
}

// Actualizar tarea en LocalStorage
function actualizarTarea(tareaAnt, estadoAnt, tareaNueva, estadoNueva) {
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas = tareas.map(t =>
        t.tarea === tareaAnt && t.estado === estadoAnt
            ? { tarea: tareaNueva, estado: estadoNueva }
            : t
    );
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

// Función para guardar la tarea en LocalStorage
function guardarTarea(tarea, estado) {
    const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas.push({ tarea, estado });
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

// Función para borrar la tarea de LocalStorage
function borrarTarea(tarea, estado) {
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas = tareas.filter(t => !(t.tarea === tarea && t.estado === estado));
    localStorage.setItem('tareas', JSON.stringify(tareas));
}