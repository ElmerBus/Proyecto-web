// const botonAgregar = document.getElementById('btnAgregar')
// const botonGuardar = document.querySelector('.btnGuardar')
// const txtCodigo = document.getElementById('txtCodigo')
// const bodyTabla = document.querySelector('.bodyTablaDinamica')

// // =========================
// // 🔹 OBTENER CÓDIGOS
// // =========================
// async function obtenerCodigos() {
//     try {
//         const token = sessionStorage.getItem('token')

//         const res = await fetch("/api/Proyecto", {
//             headers: {
//                 "Authorization": `Bearer ${token}`
//             }
//         })

//         if (!res.ok) return []

//         return await res.json()

//     } catch (e) {
//         console.log("ERROR API", e)
//         return []
//     }
// }

// // =========================
// // 🔹 CREAR FILA
// // =========================
// function crearFila(codigo) {

//     document.getElementById('filaVacia').style.display = 'none'

//     const fila = document.createElement('tr')

//     fila.innerHTML = `
//         <td class="codigo"><b>${codigo}</b></td>

//         <td><input class="h" type="number" min="0" max="24"></td>
//         <td><input class="h" type="number" min="0" max="24"></td>
//         <td><input class="h" type="number" min="0" max="24"></td>
//         <td><input class="h" type="number" min="0" max="24"></td>
//         <td><input class="h" type="number" min="0" max="24"></td>
//         <td><input class="h" type="number" min="0" max="24"></td>
//         <td><input class="h" type="number" min="0" max="24"></td>

//         <td class="total">0</td>

//         <td><button class="eliminar">Eliminar</button></td>
//     `

//     // eliminar fila
//     fila.querySelector('.eliminar').addEventListener('click', () => {
//         fila.remove()

//         if (!bodyTabla.querySelector('tr')) {
//             document.getElementById('filaVacia').style.display = 'table-row'
//         }
//     })

//     bodyTabla.appendChild(fila)
// }

// // =========================
// // 🔹 AGREGAR CÓDIGO
// // =========================
// botonAgregar.addEventListener('click', async () => {

//     const codigo = txtCodigo.value.trim().toUpperCase()
//     if (!codigo) return alert("Ingresa código")

//     const lista = await obtenerCodigos()
//     const existe = lista.some(e => e.codigo === codigo)

//     if (!existe) return alert("Código no existe")

//     if (document.querySelector(`tr[data-codigo="${codigo}"]`)) {
//         return alert("Ya agregado")
//     }

//     crearFila(codigo)
//     txtCodigo.value = ""
// })

// // =========================
// // 🔹 GUARDAR REGISTROS
// // =========================
// botonGuardar.addEventListener('click', async () => {

//     const filas = document.querySelectorAll('.bodyTablaDinamica tr')

//     if (!filas.length) return alert("No hay registros")

//     const token = sessionStorage.getItem('token')
//     const noUsuario = sessionStorage.getItem('nUsu')

//     try {

//         for (let fila of filas) {

//             const codigo = fila.querySelector('.codigo')?.innerText
//             if (!codigo) continue

//             const inputs = fila.querySelectorAll('input.h')

//             let totalHoras = 0

//             inputs.forEach(i => {
//                 totalHoras += Number(i.value) || 0
//             })

//             const data = {
//                 codigo: codigo,
//                 fecha: new Date().toISOString(),
//                 horas: totalHoras,
//                 noUsuario: Number(noUsuario),
//                 periodoId: 1
//             }

//             const res = await fetch("/api/RegistroJornada", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`
//                 },
//                 body: JSON.stringify(data)
//             })

//             if (!res.ok) {
//                 console.log(await res.text())
//             }
//         }

//         alert("Registros guardados correctamente")

//     } catch (e) {
//         console.log("ERROR:", e)
//     }
// })