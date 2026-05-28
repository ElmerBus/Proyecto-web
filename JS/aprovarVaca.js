// Referencias del DOM
const bodyTablaDinamica = document.getElementById('bodyTablaDinamica');
const buscarNom = document.getElementById('buscarNombre');
const filtroEstados = document.getElementById('filtroEstados');
const buscarFecha = document.getElementById('buscarFecha');
const botonLimpiar = document.getElementById('botonLimpiar');
let listaVaca;

async function datos() {
    listaVaca = await aprovarVaca()
}

function actualizarTabla() {
    const nombreFiltrado = buscarNom.value.toLowerCase();
    const estadoFiltrado = filtroEstados.value;
    const fechaFiltrada = buscarFecha.value.toLowerCase();

    // Filtrar la lista de empleados
    const listaFiltrada = empleados.filter(emp => {
        const nombreSimilar = emp.nombreSolicitante.toLowerCase().includes(nombreFiltrado);
        const estadoSimilar = (estadoFiltrado === "Todos" || emp.estadoAprobacion === estadoFiltrado);
        const fechaSimilar = (emp.fechaInicio.includes(fechaFiltrada) || emp.fechaFin.includes(fechaFiltrada));

        return nombreSimilar && estadoSimilar && fechaSimilar;
    });

    // Limpiar contenido previo
    bodyTablaDinamica.innerHTML = "";

    // Construir filas
    listaFiltrada.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${emp.solicitanteId}</td>
            <td>${emp.nombreSolicitante} </td>
            <td>${emp.fechaInicio}</td>
            <td>${emp.fechaFin}</td>
            <td><span class="diseño-estado">${emp.estadoAprobacion}</span></td>
            <td>
                <select class="menu-acciones" onchange="seleccionaNuevoEstado(${emp.id}, this.value)">
                    <option value="">Cambiar estado</option>
                    <option value="Activa">Aprobado</option>
                    <option value="Pausada">En espera</option>
                    <option value="Denegado">Denegado</option>
                </select>
            </td>
        `;
        bodyTablaDinamica.appendChild(row);
    });

    window.seleccionaNuevoEstado = function (id, estadoNuevo) {
        const index = empleados.findIndex(e => e.id === id);
        if (index !== -1) {
            empleados[index].estado = estadoNuevo;
            actualizarTabla(); // Actualiza la bista de la tabla
        }
    }
}
botonLimpiar.addEventListener('click', () => {
    buscarNom.value = "";
    filtroEstados.value = "";
    buscarFecha.value = "";
    actualizarTabla();
});

buscarNom.addEventListener('input', actualizarTabla);
filtroEstados.addEventListener('change', actualizarTabla);
buscarFecha.addEventListener('input', actualizarTabla);

document.addEventListener('DOMContentLoaded', datos);
