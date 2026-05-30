const fechaFin = document.getElementById('fechaFinal')
const fechaIni = document.getElementById('fechaInicio')
const enviar = document.getElementById('enviar')
console.log(enviar)
enviar.addEventListener('click', solicitar)

async function solicitar() {
      if (
            validarCampo(fechaFin) &&
            validarCampo(fechaIni)
      ) {
            const token = sessionStorage.getItem('token')
            const nuSu = sessionStorage.getItem('nUsu')

            const datos = {
                  fechaInicio: fechaIni.value,
                  fechaFin: fechaFin.value,
                  solicitanteId: nuSu
            }
            try {
                  const respuesta = await fetch(`/api/Vacacion`, {

                        method: "POST",
                        headers: {
                              "Authorization": `Bearer ${token}`,
                              "Content-Type": "application/json"
                        },
                        body: JSON.stringify(datos)
                  })
                  const data = await respuesta.json();

                  if (respuesta.ok) {
                        alert("Se envio la solicitud");
                  }

            } catch {
                  alert("Error con la api")
            }
      }
}