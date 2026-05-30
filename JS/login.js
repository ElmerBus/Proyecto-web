function verContrasena(campoPassword) {
      if (campoPassword.type === "password") {
            campoPassword.placeholder = "Contraseña";
            campoPassword.type = "text";
      } else {
            campoPassword.placeholder = "••••••••";

            campoPassword.type = "password";
      }
}

function validarCampo(campo) {
      if (campo.value.trim() === '') {
            campo.autocomplete = "off"
            campo.setCustomValidity(
                  'Por favor, llena este campo'
            );
            campo.reportValidity();
            campo.requiered = 'true'

            return false;
      }
      return true

}
const link = document.getElementById('link')
const identificador = document.getElementById('empleado')
const contrasena = document.getElementById('password')
const btnIniciar = document.getElementById('btn-login')
const btnVer = document.getElementById('btn-ver')

btnVer.addEventListener('click', ()=>{
      verContrasena(contrasena)
})

btnIniciar.addEventListener('click', iniciarSesion)

async function iniciarSesion() {

      if (
            validarCampo(identificador) &&
            validarCampo(contrasena)
      ) {
            const datos = {
                  identificador: identificador.value,
                  contrasena: contrasena.value
            }

            try {
                  const respuesta = await fetch("/api/LogIn/login", {
                        method: "POST",
                        headers: {
                              "Content-Type": "application/json"
                        },
                        body: JSON.stringify(datos)
                  })


                  const resultado = await respuesta.json()
                  console.log(resultado)
                  if (respuesta.ok) {

                        sessionStorage.setItem("token", resultado.user.token)
                        sessionStorage.setItem("nUsu", resultado.user.noUsuario)

                        if (resultado.user.esManager) {
                              
                              window.location.href = "../HTML/Empleados.html";
                              console.log(resultado.message)
                        } else {
                              window.location.href = "../HTML/Captura.html";
                              console.log(resultado.message)
                        }

                  } else {

                        alert(resultado.message)
                  }

            } catch {
                  alert("Erro con la api")
            }
      }
}



link.addEventListener('click', () => {
      validarCampo(identificador)
})