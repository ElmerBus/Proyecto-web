if(sessionStorage.getItem("tipUsu")==="false"){
      window.location.href="../HTMl/login.html"
}
const buscarNom = document.getElementById('buscarNombre');
const buscarCod = document.getElementById('buscarCodigo');

const botonLimpiar = document.getElementById('botonLimpiar');
let empresas




async function actualizarTabla() {
      const nombreFiltrado = buscarNom.value.toLowerCase();
      const codigoFiltrado = buscarCod.value.toLowerCase();

      empresas = await obtenEmpresas()

      const listaFiltrada = empresas.filter(emp => {
            const nombreSimilar = emp.nombre.toLowerCase().includes(nombreFiltrado)
            let codigoSimilar

            if (emp.codigoNoCobrable !== null && emp.codigoCobrable !== null) {
                  codigoSimilar = emp.codigoNoCobrable.toLowerCase().includes(codigoFiltrado) || emp.codigoCobrable.toLowerCase().includes(codigoFiltrado)
            } else {
                  if (emp.codigoCobrable !== null) {
                        codigoSimilar = emp.codigoCobrable.toLowerCase().includes(codigoFiltrado)
                  } else {
                        if (emp.codigoNoCobrable !== null) {
                              codigoSimilar = emp.codigoNoCobrable.toLowerCase().includes(codigoFiltrado)

                        }
                  }
            }
            return nombreSimilar && codigoSimilar
      });

      bodyTablaDinamica.innerHTML = "";

      listaFiltrada.forEach(emp => {
            const row = document.createElement('tr');
            let codCob, codNoCob
            if (emp.codigoCobrable === null) {
                  codCob = ""
            } else {
                  codCob = emp.codigoCobrable
            }

            if (emp.codigoNoCobrable === null) {
                  codNoCob = ""
            } else {
                  codNoCob = emp.codigoNoCobrable
            }

            row.innerHTML = `
                <td>${emp.idEmpresa}</td>
                <td>${emp.nombre} </td>
                <td>${codCob} </td>
                <td>${codNoCob}</td>
            `;
            bodyTablaDinamica.appendChild(row);
      });

}
botonLimpiar.addEventListener('click', () => {
      buscarNom.value = "";
      buscarCodigo.value = "";
      actualizarTabla();
});

buscarNom.addEventListener('input', actualizarTabla);
buscarCodigo.addEventListener('input', actualizarTabla);

document.addEventListener('DOMContentLoaded', actualizarTabla);


//____________________________________________________________________________
const btnReg = document.getElementById('btn_guardar')
const empresa = document.getElementById('nomEmpresa')

empresa.addEventListener('input', () => {
      if (validarCampo(empresa)) {
            btnReg.disabled = false;
            btnReg.style.backgroundColor = "#d68fe8"
      } else {
            btnReg.disabled = true;
            btnReg.style.backgroundColor = "white"
      }
})

btnReg.addEventListener("click", nuevaEmpresa)

async function nuevaEmpresa() {
      if (
            validarCampo(empresa)
      ) {
            let tipo = document.querySelector('input[name=cobro]:checked')
            const datos = {
                  nombre: empresa.value.trim(),
                  tipoProyecto: tipo.value
            }
            try {

                  const token = sessionStorage.getItem('token')
                  const respuesta = await fetch("https://localhost:7293/api/Empresa", {
                        method: "POST",
                        headers: {
                              "Authorization": `Bearer ${token}`,
                              "Content-Type": "application/json"
                        },
                        body: JSON.stringify(datos)
                  })

                  if (respuesta.status == 409) {
                        const tipoPro = await fetch(`https://localhost:7293/api/Empresa/${id}`, {
                              method: "GET",
                              headers: {
                                    "Authorization": `Bearer ${token}`,
                                    "Content-Type": "application/json"
                              }
                        })
                        const empresaExistente = await respuestaEmpresa.json();

                        if (tipo === empresaExistente.tipoProyecto) {

                              mostrarAlerta("Mostrar mensaje de asignar el codigo que falta", "error")
                        } else {
                              const tipoPro = await fetch(`https://localhost:7293/api/Empresa/update`, {
                                    method: "POST",
                                    headers: {
                                          "Authorization": `Bearer ${token}`,
                                          "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(datos)
                              })
                              actualizarTabla()
                        }
                  } else {
                        mostrarAlerta("Empresa registrada con exito", "exito")
                        actualizarTabla()
                  }

            } catch {
                  mostrarAlerta("Error con el servidor", "error")
            }
      }
}

async function obtenEmpresas() {

      try {
            const token = sessionStorage.getItem('token')
            const respuesta = await fetch("https://localhost:7293/api/Empresa", {

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
