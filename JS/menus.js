document.addEventListener('DOMContentLoaded', verificarToken);
async function verificarToken() {
      try {
            const token = sessionStorage.getItem('token');
            
            
            if (!token) {
                  redirigirAlLogin();
                  return false;
            }

            const respuesta = await fetch(`/api/LogIn/logout`, {
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
      } catch (error) {
            console.error("Error con la API:", error);
            redirigirAlLogin(); 
      }
}


function redirigirAlLogin() {
      sessionStorage.removeItem('nUsu');
      sessionStorage.removeItem('token'); // Es buena idea borrar también el token inválido
      window.location.href = "../HTML/login.html";
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

/*
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
            console.log(datos)
            nom.textContent = `${datos.nombre} ${datos.ap_paterno}  ${datos.ap_materno}`
      }


      catch {

            alert('error en la api')
      }
}

*/
const salir=document.getElementById('logout')
const salir1=document.getElementById('logout1')

salir1.addEventListener('click',logout)
salir.addEventListener('click',logout)

async function logout() {
      try {
            const token = sessionStorage.getItem('token')
            
            const respuesta = await fetch(`/api/LogIn/logout`, {

                  method: "POST",
                  headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                  },
            })

            if (respuesta.status == 200) {
                  sessionStorage.removeItem('token')
                  sessionStorage.removeItem('nUsu')
                  window.location.href="../HTML/login.html"
            } else {
                  return false
            }
      } catch {
            console.log("ERROR CON LA APasIS")
      }
}
