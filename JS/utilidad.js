
//*************************LLAMADAS************** */
//-------------------FETCH INICIAR SESSION-------------------------------------------------------------------


//-------------------FETCH NUEVO USUARIO-------------------------------------------------------------------


//-----------------------USUARIOS---------------------------------------------------------------------------------

//---------------------Obtner datos del usuario---------------------------------------------------------------------

async function usuario(id) {
      try {
            const respuesta = await fetch(`https://localhost:7293/api/Usuario/${id}`, {
                  method: "GET",
                  headers: {
                        "Content-Type": "application/json"
                  }
            })
            const datos = await respuesta.json()
            return datos
      } catch {
            console.log("ERROR CON LA APIS")
      }

}
//------------------------Nueva empresa-----------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------
























//-----------------------Revisar vacaciones---------------------------------------------------------------------------------
async function aprovarVaca() {
      try {
            const respuesta = await fetch("https://localhost:7293/api/Vacacion", {
                  method: "GET",
                  headers: {
                        "Content-Type": "application/json"
                  }
            })

            const datos = await respuesta.json()
            console.log(datos)
            return datos

      } catch {
            console.log("ERROR CON LA APIS")
      }

}


//---------------------FETCH VACACIONESS---------------------------------------------------------------------

async function soliVacaciones(fechaIni, fechaFin/*, numEmp*/) {
      if (
            validarCampo(fechaIni) &&
            validarCampo(fechaFin) //&&
            //numEmp != ""
      ) {
            console.log(fechaIni.value)
            console.log(fechaFin.value)

            const datos = {
                  fechaInicio: fechaIni.value,
                  fechaFin: fechaFin.value,
                  solicitanteId: "1000004"
            }
            try {
                  const respuesta = await fetch("https://localhost:7293/api/Vacacion ", {
                        method: "POST",
                        headers: {
                              "Content-Type": "application/json"
                        },
                        body: JSON.stringify(datos)
                  })

            } catch {
                  console.log("ERROR CON LA APIS")
            }
      }
}
//-----------------------------------------------------------------------------------------
async function peticion(url, metodo, datos) {
      try {
            const llamada = await fetch(url, {
                  method: metodo,
                  headers: {
                        "Content-Type": "application/json"
                  },
                  credentials: "include",
                  body: JSON.stringify(datos)
            })


      } catch {

      }

}