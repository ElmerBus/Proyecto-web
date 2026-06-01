if(sessionStorage.getItem("tipUsu")==="true"){
      window.location.href="../HTMl/login.html"
}

const fechaFin = document.getElementById('fechaFinal')
const fechaIni = document.getElementById('fechaInicio')
const enviar = document.getElementById('enviar')

enviar.addEventListener('click', solicitar)

async function solicitar() {
      if (
            validarCampo(fechaIni) &&
            validarCampo(fechaFin) 
            
      ) {
            const token = sessionStorage.getItem('token')
            const nuSu = sessionStorage.getItem('nUsu')

            const datos = {
                  fechaInicio: fechaIni.value,
                  fechaFin: fechaFin.value,
                  solicitanteId: nuSu
            }
            
            try {
                  const respuesta = await fetch(`https://localhost:7293/api/Vacacion`, {

                        method: "POST",
                        headers: {
                              "Authorization": `Bearer ${token}`,
                              "Content-Type": "application/json"
                        },
                        body: JSON.stringify(datos)
                  })
                  
                  const data = await respuesta.json();
                  if (respuesta.ok) {
                        mostrarAlerta("Solicitud enviada","exito")
                  }else{
                        mostrarAlerta(data.message,"error")
                  }

            } catch {
                  mostrarAlerta("Error con el servidor", "error")
            }
      }
}