const btnReg = document.getElementById('btnRegistrar')
const numUsuario = document.getElementById('numUsuario')
const nombre = document.getElementById('nombre')
const apellido1 = document.getElementById('apPat')
const apellido2 = document.getElementById('apMat')
const correo = document.getElementById('correo')
const manager = document.getElementById('rol')

btnReg.addEventListener("click", nuevoUsuario)

async function nuevoUsuario() {
      if (
            validarCampo(numUsuario) &&
            validarCampo(nombre) &&
            validarCampo(apellido1) &&
            validarCampo(apellido2) &&
            validarCampo(correo) &&
            validarCampo(manager)
      ) {
            const rol= manager.value ==="true"
            
            const datos = {
                  noUsuario: numUsuario.value,
                  nombre: nombre.value,
                  apPaterno: apellido1.value,  
                  apMaterno: apellido2.value,
                  email: correo.value,
                  contrasena: "Ferrocarril12!?2",
                  esManager: rol
            }
            try {
                  const token = sessionStorage.getItem('token')
                  const respuesta = await fetch("https://localhost:7293/api/Usuario", {
                        method: "POST",
                        headers: {
                              "Authorization": `Bearer ${token}`,
                              "Content-Type": "application/json"
                        },
                        body: JSON.stringify(datos)
                  })
                  const data = await respuesta.json();

                  if (respuesta.status ==201 ){
                        limpiar()
                        mostrarAlerta(data.message,"exito")
                        
                  } else {
                        mostrarAlerta(data.message,"error")
                        
                  }

            } catch {

                  mostrarAlerta("Error con el servidor", "error")
            }
      }

}

function limpiar() {
      numUsuario.value=""
      nombre.value=""
      apellido1.value=""
      apellido2.value=""
      correo.value=""
      manager.value=""
}