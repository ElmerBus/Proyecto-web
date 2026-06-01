document.addEventListener('DOMContentLoaded', verificarToken);
async function verificarToken() {
      try {
            const token = sessionStorage.getItem('token');


            if (!token) {
                  redirigirAlLogin();
                  return false;
            }

            const respuesta = await fetch(`https://localhost:7293/api/LogIn/logout`, {
                  method: "POST",
                  headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                  },
            });

            if (respuesta.status !== 200) {
                  redirigirAlLogin();
                  return false;
            }

            return true;
      } catch {
            redirigirAlLogin();
      }
}


function redirigirAlLogin() {
      sessionStorage.removeItem('nUsu');
      sessionStorage.removeItem('token');
      window.location.href = "../HTML/login.html";
}
nombre()


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
//___________________________________________________________________

const btnMenu = document.getElementById('btnMenu')
const opcionMenu = document.getElementById('opcionMenu')


if (btnMenu !== null) {
      btnMenu.addEventListener('click', activarMenu)
}

if (opcionMenu !== null) {
      opcionMenu.addEventListener('click', mostrarSubmenu)
}


function mostrarSubmenu() {

      let submenu = document.getElementById('submenuUsuarios');

      submenu.classList.toggle("mostrarSubmenu");

}

function activarMenu() {

      let menu = document.getElementById("menuMovil");

      menu.classList.toggle("mostrarMenu");

}


const salir = document.getElementById('logout')
const salir1 = document.getElementById('logout1')

salir1.addEventListener('click', logout)
salir.addEventListener('click', logout)

async function logout() {
      try {
            const token = sessionStorage.getItem('token')

            const respuesta = await fetch(`https://localhost:7293/api/LogIn/logout`, {

                  method: "POST",
                  headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                  },
            })

            if (respuesta.status == 200) {
                  sessionStorage.removeItem('token')
                  sessionStorage.removeItem('nUsu')
                  window.location.href = "../HTML/login.html"
            } else {
                  return false
            }
      } catch {
            mostrarAlerta("Error con el servidor", "error")
      }
}

async function nombre() {

      const nom = document.getElementById('nombre')

      try {
            const numUsuario = sessionStorage.getItem("nUsu")
            const token = sessionStorage.getItem("token")
            const respuesta = await fetch(`https://localhost:7293/api/Usuario/${numUsuario}`, {
                  method: "GET",
                  headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                  }
            })
            const datos = await respuesta.json()
            nom.textContent = `${datos.nombre_completo}`
      }


      catch {

            mostrarAlerta("Error en el servidor", "error")
      }
}