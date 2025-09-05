const addBtn = document.getElementById('addBtn');
const todoBody = document.getElementById('todoBody');
const searchInput = document.getElementById('searchInput');
const filterEstado = document.getElementById('filterEstado');
const contador = document.getElementById('contador');
const darkModeBtn = document.getElementById('darkModeBtn');
const exportBtn = document.getElementById('exportBtn');

let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

// Cargar tareas guardadas al iniciar
window.addEventListener('DOMContentLoaded', () => {
    renderTareas();
    actualizarContador();
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
    }
});

// Añadir tarea
addBtn.addEventListener('click', () => {
    if (document.querySelector('.input-row')) return;
    const row = document.createElement('tr');
    row.classList.add('input-row');
    row.innerHTML = `
        <td></td>
        <td><input type="text" placeholder="Nueva tarea"></td>
        <td>
            <select>
                <option>Pendiente</option>
                <option>En proceso</option>
                <option>Completada</option>
            </select>
        </td>
        <td>
            <select>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
            </select>
        </td>
        <td>${new Date().toLocaleDateString()}</td>
        <td>
            <button class="confirmBtn" title="Confirmar">✔️</button>
        </td>
    `;
    todoBody.prepend(row);

    const input = row.querySelector('input');
    const selectEstado = row.querySelectorAll('select')[0];
    const selectPrioridad = row.querySelectorAll('select')[1];
    const confirmBtn = row.querySelector('.confirmBtn');

    confirmBtn.addEventListener('click', () => {
        if (input.value.trim() !== '') {
            const tarea = {
                tarea: input.value.trim(),
                estado: selectEstado.value,
                prioridad: selectPrioridad.value,
                fecha: new Date().toLocaleDateString(),
                completada: selectEstado.value === "Completada"
            };
            tareas.unshift(tarea);
            guardarTareas();
            renderTareas();
        }
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim() !== '') {
            confirmBtn.click();
        }
    });

    input.focus();
});

// Renderizar tareas
function renderTareas() {
    todoBody.innerHTML = "";
    let filtro = tareas.filter(t => {
        const texto = searchInput.value.toLowerCase();
        const coincideTexto = t.tarea.toLowerCase().includes(texto);
        const coincideEstado = !filterEstado.value || t.estado === filterEstado.value;
        return coincideTexto && coincideEstado;
    });

    filtro.forEach((t, idx) => {
        const row = document.createElement('tr');
        if (t.estado === "Completada" || t.completada) row.classList.add('completada');
        row.innerHTML = `
            <td>
                <input type="checkbox" ${t.estado === "Completada" || t.completada ? "checked" : ""} title="Marcar completada">
            </td>
            <td>${t.tarea}</td>
            <td>${t.estado}</td>
            <td><span class="prioridad-${t.prioridad}">${t.prioridad.charAt(0).toUpperCase() + t.prioridad.slice(1)}</span></td>
            <td>${t.fecha}</td>
            <td>
                <button class="editBtn" title="Editar">✏️</button>
                <button class="deleteBtn" title="Borrar">🗑️</button>
            </td>
        `;
        todoBody.appendChild(row);

        // Checkbox completada
        row.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
            t.estado = e.target.checked ? "Completada" : "Pendiente";
            t.completada = e.target.checked;
            guardarTareas();
            renderTareas();
        });

        // Botón borrar
        row.querySelector('.deleteBtn').addEventListener('click', () => {
            tareas.splice(tareas.indexOf(t), 1);
            guardarTareas();
            renderTareas();
        });

        // Botón editar
        row.querySelector('.editBtn').addEventListener('click', () => {
            editarFila(row, t);
        });
    });
    actualizarContador();
}

// Editar tarea
function editarFila(row, tareaObj) {
    row.innerHTML = `
        <td></td>
        <td><input type="text" value="${tareaObj.tarea}"></td>
        <td>
            <select>
                <option${tareaObj.estado === 'Pendiente' ? ' selected' : ''}>Pendiente</option>
                <option${tareaObj.estado === 'En proceso' ? ' selected' : ''}>En proceso</option>
                <option${tareaObj.estado === 'Completada' ? ' selected' : ''}>Completada</option>
            </select>
        </td>
        <td>
            <select>
                <option value="alta"${tareaObj.prioridad === 'alta' ? ' selected' : ''}>Alta</option>
                <option value="media"${tareaObj.prioridad === 'media' ? ' selected' : ''}>Media</option>
                <option value="baja"${tareaObj.prioridad === 'baja' ? ' selected' : ''}>Baja</option>
            </select>
        </td>
        <td>${tareaObj.fecha}</td>
        <td>
            <button class="confirmBtn" title="Confirmar">✔️</button>
            <button class="deleteBtn" title="Borrar">🗑️</button>
        </td>
    `;
    const input = row.querySelector('input');
    const selectEstado = row.querySelectorAll('select')[0];
    const selectPrioridad = row.querySelectorAll('select')[1];
    const confirmBtn = row.querySelector('.confirmBtn');
    const deleteBtn = row.querySelector('.deleteBtn');

    confirmBtn.addEventListener('click', () => {
        if (input.value.trim() !== '') {
            tareaObj.tarea = input.value.trim();
            tareaObj.estado = selectEstado.value;
            tareaObj.prioridad = selectPrioridad.value;
            tareaObj.completada = selectEstado.value === "Completada";
            guardarTareas();
            renderTareas();
        }
    });

    deleteBtn.addEventListener('click', () => {
        tareas.splice(tareas.indexOf(tareaObj), 1);
        guardarTareas();
        renderTareas();
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim() !== '') {
            confirmBtn.click();
        }
    });

    input.focus();
}

// Guardar tareas en localStorage
function guardarTareas() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

// Buscador y filtro
searchInput.addEventListener('input', renderTareas);
filterEstado.addEventListener('change', renderTareas);

// Contador de tareas
function actualizarContador() {
    const total = tareas.length;
    const completadas = tareas.filter(t => t.estado === "Completada" || t.completada).length;
    contador.textContent = `Total: ${total} | Completadas: ${completadas}`;
}

// Modo oscuro
darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});

// Exportar tareas a JSON
exportBtn.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tareas, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "tareas.json");
    dlAnchorElem.click();
});