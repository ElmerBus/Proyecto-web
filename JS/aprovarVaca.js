const bodyTablaDinamica = document.getElementById('bodyTablaDinamica');
const buscarNom = document.getElementById('buscarNombre');
const filtroEstados = document.getElementById('filtroEstados');
const buscarFecha = document.getElementById('buscarFecha');
const botonLimpiar = document.getElementById('botonLimpiar');
let listaVaca;

async function actualizarTabla() {
    const nombreFiltrado = buscarNom.value.toLowerCase();
    const estadoFiltrado = filtroEstados.value;
    const fechaFiltrada = buscarFecha.value.toLowerCase();

    listaVaca = await vacaciones()

    const listaFiltrada = listaVaca.filter(emp => {
        //const nombreSimilar = emp.solicitanteId.toLowerCase().includes(nombreFiltrado);
        const estadoSimilar = (estadoFiltrado === "Todos" || emp.estado === estadoFiltrado);
        const fechaSimilar = (emp.fechaInicio.includes(fechaFiltrada) || emp.fechaFin.includes(fechaFiltrada));

        return estadoSimilar && fechaSimilar;
    });


    bodyTablaDinamica.innerHTML = "";

    listaFiltrada.forEach(emp => {
        const row = document.createElement('tr');
        let opciones = ""
        if (emp.estado === "Pendiente") {
            opciones = `<select class="menu-acciones" data-id="${emp.vacacionId}">
                <option value="">Cambiar estado</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Rechazada">Rechazada</option>
            </select>`
        }
        row.innerHTML = `
            <td>${emp.vacacionId}</td>
            <td>${emp.solicitanteId}</td>
            <td>${emp.fechaInicio}</td>
            <td>${emp.fechaFin}</td>
            <td>${emp.estado}</td>
            <td>
                ${opciones}
            </td>
        `;
        bodyTablaDinamica.appendChild(row);
    });
}
botonLimpiar.addEventListener('click', () => {
    buscarNom.value = "";
    filtroEstados.value = "";
    buscarFecha.value = "";
    actualizarTabla();
});

buscarNom.addEventListener('input', actualizarTabla);
buscarFecha.addEventListener('input', actualizarTabla);
filtroEstados.addEventListener('change', actualizarTabla)


bodyTablaDinamica.addEventListener('change', async (e) => {
    if (e.target.classList.contains('menu-acciones')) {

        try {
            const token = sessionStorage.getItem('token')

            const id = e.target.dataset.id

            const datos = {
                estadoDecision: e.target.value
            }

            const respuesta = await fetch(`https://localhost:7293/api/Vacacion/${id}/evaluar`, {

                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            })


            if (respuesta.status == 200) {
                actualizarTabla()
            }else{
                
            }

                

            
        } catch {
            console.log("ERROR CON LA APIS")
        }
    }
})

document.addEventListener('DOMContentLoaded', actualizarTabla);

async function vacaciones() {
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch("https://localhost:7293/api/Vacacion", {

            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })

        const datos = await respuesta.json()
        return datos

    } catch {
        console.log("ERROR CON LA APIS")
    }
}

