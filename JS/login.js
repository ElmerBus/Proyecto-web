function mostrarAlerta(mensaje, tipo) {

      let alerta = document.getElementById("alerta");

      alerta.innerText = mensaje;

      alerta.className = "alerta";

      if (tipo == "exito") {
            alerta.classList.add("exito");
      } else {
            alerta.classList.add("error");
      }

      alerta.style.display = "block";

      setTimeout(function () {
            alerta.style.display = "none";
      }, 3000);
}
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
                  const respuesta = await fetch("https://localhost:7293/api/LogIn/login", {
                        method: "POST",
                        headers: {
                              "Content-Type": "application/json"
                        },
                        body: JSON.stringify(datos)
                  })


                  const resultado = await respuesta.json()
      
                  if (respuesta.ok) {

                        sessionStorage.setItem("token", resultado.user.token)
                        sessionStorage.setItem("nUsu", resultado.user.noUsuario)
                        sessionStorage.setItem("tipUsu",resultado.user.esManager)

                        if (resultado.user.esManager) {
                              
                              window.location.href = "../HTML/Empleados.html";

                        } else {
                              window.location.href = "../HTML/Captura.html";

                        }

                  } else {

                        mostrarAlerta(resultado.message,"error")
                  }

            } catch {
                  mostrarAlerta("Error con el servidor", "error")
            }
      }
}



link.addEventListener('click', () => {
      validarCampo(identificador)
})