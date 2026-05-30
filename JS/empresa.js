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
                <td></td>
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
                  nombre: empresa.value,
                  tipoProyecto: tipo.value
            }
            console.log(datos)
            try {

                  const token = sessionStorage.getItem('token')
                  const respuesta = await fetch("/api/Empresa", {
                        method: "POST",
                        headers: {
                              "Authorization": `Bearer ${token}`,
                              "Content-Type": "application/json"
                        },
                        body: JSON.stringify(datos)
                  })
                  const resultado = await respuesta.json()
                  actualizarTabla()
                  alert(resultado.message)

            } catch {

                  alert("ERROR CON LA APIS")
            }
      }
}

async function obtenEmpresas() {

      try {
            const token = sessionStorage.getItem('token')
            const respuesta = await fetch("/api/Empresa", {

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
