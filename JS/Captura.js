registros()
async function mostrarTabla() {

      reg = await registros()
      reg.forEach(emp => {
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
                  boton = '<button class="accion-estado">❚❚</button>'
            } else {
                  estado = "No activa"
                  boton = '<button class="accion-estado">▶</button>'
            }
            row.innerHTML = `
                <td>${emp.noUsuario}</td>
                <td>${emp.nombre} </td>
                <td>${emp.apPaterno} </td>
                <td>${emp.apMaterno}</td>
                <td>${emp.email}</td>
                <td>${rol}</td>
                <td><span class="diseño-estado">${estado}</span></td>
                <td>
                    ${boton}
                    <button class="accion-editar">✎</button>
                </td>
            `;
            bodyTablaDinamica.appendChild(row);
      });

}

async function registros() {
      try {
            const token = sessionStorage.getItem('token')
            const usu = sessionStorage.getItem('nUsu')
            const respuesta = await fetch(`https://localhost:7293/api/RegistroJornada/${usu}`, {

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