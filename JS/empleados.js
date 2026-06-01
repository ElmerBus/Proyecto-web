const bodyTablaDinamica = document.getElementById('bodyTablaDinamica');
const buscarNom = document.getElementById('buscarNombre');
const buscarCorreo = document.getElementById('buscarCorreo');
const buscarNum = document.getElementById('buscarNum');
const botonLimpiar = document.getElementById('botonLimpiar');
let empleados

async function actualizarTabla() {
    const nombreFiltrado = buscarNom.value.toLowerCase();
    const correoFiltrado = buscarCorreo.value.toLowerCase();
    const numFiltrado = buscarNum.value;

    empleados = await usuarios()


    const listaFiltrada = empleados.filter(emp => {
        const nombreSimilar = emp.nombre.toLowerCase().includes(nombreFiltrado) || emp.apPaterno.toLowerCase().includes(nombreFiltrado) || emp.apMaterno.toLowerCase().includes(nombreFiltrado);
        const correoSimilar = emp.email.toLowerCase().includes(correoFiltrado);
        const numSimilar = String(emp.noUsuario).includes(numFiltrado);

        return nombreSimilar && correoSimilar && numSimilar;
    });


    bodyTablaDinamica.innerHTML = "";

    listaFiltrada.forEach(emp => {
        const row = document.createElement('tr');
        row.dataset.rowversion = emp.rowVersion

        let rol, estado, boton;
        if (emp.esManager) {
            rol = "Manager"
        } else {
            rol = "Empleado"
        }
        if (emp.estadoCuenta) {
            estado = "Activa"
            boton = '<button class="accion-pausar">❚❚</button>'
        } else {
            estado = "No activa"
            boton = '<button class="accion-activar">▶</button>'
        }
        row.innerHTML = `
                <td>${emp.noUsuario}</td>
                <td>${emp.nombre} </td>
                <td>${emp.apPaterno} </td>
                <td>${emp.apMaterno}</td>
                <td>${emp.email}</td>
                <td>${rol}</td>
                <td>${estado}</td>
                <td>
                    ${boton}
                    <button class="accion-editar">✎</button>
                </td>
            `;
        bodyTablaDinamica.appendChild(row);
    });

}

bodyTablaDinamica.addEventListener('click', (e) => {

    const fila = e.target.closest('tr');

    if (!fila) return;

    const numEmp = fila.cells[0].textContent;

    if (e.target.classList.contains('accion-editar')) {
        e.target.textContent = "💾"

        e.target.classList.remove('accion-editar');
        e.target.classList.add('accion-guardar')


        fila.style.backgroundColor = " rgba(233, 233, 233, 0.858";
        const celdas = fila.querySelectorAll('td');

        celdas[1].innerHTML = `<input class="editar" value="${celdas[1].textContent}">`;
        celdas[2].innerHTML = `<input class="editar" value="${celdas[2].textContent}">`;
        celdas[3].innerHTML = `<input class="editar" value="${celdas[3].textContent}">`;
        //celdas[4].innerHTML = `<input class="editar" value="${celdas[4].textContent}">`;
        celdas[5].innerHTML = `<select>
                                        <option >Manager</option>

                                        <option >Empleado</option>    
                                    </select>`;

    } else {
        if (e.target.classList.contains('accion-guardar')) {
            e.target.textContent = "✎"

            e.target.classList.remove('accion-guardar')
            e.target.classList.add('accion-editar');

            fila.style.backgroundColor = "white";
            const inputs = fila.querySelectorAll('input');
            const celdas = fila.querySelectorAll('td');
            const tipoEm = fila.querySelector('select').value
            let rol, estado
            if (tipoEm === "Empleado") {
                rol = false
            } else {
                rol = true
            }

            if (celdas[6].textContent === "Activa") {

                estado = true
            } else {
                estado = false
            }
            editar()
            async function editar() {
                try {

                    const token = sessionStorage.getItem('token')
                    const datos = {
                        noUsuario: celdas[0].textContent,
                        nombre: inputs[0].value,
                        apPaterno: inputs[1].value,
                        apMaterno: inputs[2].value,
                        email: celdas[4].textContent,
                        esManager: rol,
                        estadoCuenta: estado,
                        debeCambiarPass: false,
                        token: null,
                        rowVersion: fila.dataset.rowversion
                    }

                    const respuesta = await fetch(`https://localhost:7293/api/Usuario/${celdas[0].textContent}`, {

                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(datos)
                    })

                    if (respuesta.status == 204) {
                        actualizarTabla()
                        mostrarAlerta("Usuario actualizado con exito", "exito")
                    } else {
                        mostrarAlerta("Error al actualizar el usuario, intentalo de nuevo", "error")
                    }
                } catch {
                    mostrarAlerta("Error con el servidor", "error")
                }
            }
        }
    }




    if (e.target.classList.contains('accion-pausar')) {
        e.target.classList.remove('accion-pausar')

        e.target.classList.add('accion-activar')

        desactivar();
        async function desactivar() {
            try {
                const token = sessionStorage.getItem('token')
                const datos = {
                    rowVersion: fila.dataset.rowversion
                }

                const respuesta = await fetch(`https://localhost:7293/api/Usuario/${numEmp}/desactivar`, {

                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datos)
                })

                if (respuesta.status == 204) {
                    actualizarTabla()
                    mostrarAlerta("Usuario desactivado con exito", "exito")
                } else {
                    mostrarAlerta("Error al desactivar el usuario, intentalo de nuevo", "error")
                }
            } catch {
                mostrarAlerta("Error con el servidor", "error")

            }
        }
    } else {
        if (e.target.classList.contains('accion-activar')) {
            e.target.classList.remove('accion-ctivar')

            e.target.classList.add('accion-pausar')

            activar();
            async function activar() {
                try {
                    const token = sessionStorage.getItem('token')
                    const datos = {
                        rowVersion: fila.dataset.rowversion
                    }

                    const respuesta = await fetch(`https://localhost:7293/api/Usuario/${numEmp}/activar`, {

                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(datos)
                    })

                    if (respuesta.status == 204) {
                        actualizarTabla()
                        mostrarAlerta("Usuario activado con exito", "exito")
                    } else {
                        mostrarAlerta("Error al activar el usuario, intentalo de nuevo", "error")
                    }
                } catch {
                    mostrarAlerta("Error con el servidor", "error")
                }
            }
        }
    }

}

);

botonLimpiar.addEventListener('click', () => {
    buscarNom.value = "";
    buscarCorreo.value = "";
    buscarNum.value = "";
    actualizarTabla();
});

buscarNom.addEventListener('input', actualizarTabla);
buscarCorreo.addEventListener('input', actualizarTabla);
buscarNum.addEventListener('input', actualizarTabla);

document.addEventListener('DOMContentLoaded', actualizarTabla);

async function usuarios() {

    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch("https://localhost:7293/api/Usuario", {

            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })

        const datos = await respuesta.json()
        return datos

    } catch {
        mostrarAlerta("Error con el servidor", "error")
    }

}