const verContra = document.getElementById('vizualizar1')
const verContra1 = document.getElementById('vizualizar2')
const verContra2 = document.getElementById('vizualizar3')

const contra = document.getElementById('actualContrasena')
const nuevaContra = document.getElementById('newPass')
const confirmaContra = document.getElementById('confirmPass')


verContra.addEventListener('click', () => {
      verContrasena(contra)
})
verContra1.addEventListener('click', () => {
      verContrasena(nuevaContra)
})
verContra2.addEventListener('click', () => {
      verContrasena(confirmaContra)
})


/*
      async function cargarDatos() {

      const datos = await usuario(1000002)

      document.getElementById("nombre").value =
            datos.nombre + " " +
            datos.apPaterno + " " +
            datos.apMaterno

      document.getElementById("correo").value =
            datos.email

      document.getElementById("numeroEmpleado").value =
            datos.noUsuario
}

cargarDatos()
*/


const boton = document.getElementById('updateBtn')

boton.addEventListener('click', () => {
      cambiarContraseña()
})

async function cambiarContraseña() {
      try {
            const token = sessionStorage.getItem('token')
            const nuSu = sessionStorage.getItem('nUsu')

            const datos = {
                  contrasenaActual: contra.value,
                  nuevaContrasena: nuevaContra.value,
                  confirmarNuevaContrasena: confirmaContra.value

            }

            const respuesta = await fetch(`https://localhost:7293/api/Usuario/${nuSu}/cambiar-contrasena`, {

                  method: "POST",
                  headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                  },
                  body: JSON.stringify(datos)
            })

            const data = await respuesta.json();
            if (respuesta.ok) {
                  contra.value = "";
                  nuevaContra.value = "";
                  confirmaContra.value = "";
                  alert(data.message)
            } else {
                  alert(data.message)
            }
      } catch {
            console.log("Error en la api")
      }
}
