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
                  const respuesta = await fetch("https://localhost:7293/api/Empresa", {
                        method: "POST",
                        headers: {
                              "Authorization": `Bearer ${token}`,
                              "Content-Type": "application/json"
                        },
                        body: JSON.stringify(datos)
                  })
                  const resultado = await respuesta.json()
                  alert(resultado.message)

            } catch {

                  alert("ERROR CON LA APIS")
            }
      }
}
