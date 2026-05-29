// const bodyTablaDinamica = document.querySelector('.bodyTablaDinamica')
// const txtCodigo = document.getElementById('txtCodigo')
// let semanaOffset = 0

// Calcula el lunes de la semana actual
// const lunesBase = (() => {
//     const hoy = new Date()
//     const diff = hoy.getDay() === 0 ? -6 : 1 - hoy.getDay()
//     const lunes = new Date(hoy)
//     lunes.setDate(hoy.getDate() + diff)
//     lunes.setHours(0, 0, 0, 0)
//     return lunes
// })()

// function getLunes(offset) {
//     const d = new Date(lunesBase)
//     d.setDate(lunesBase.getDate() + offset * 7)
//     return d
// }

// function getDomingo(offset) {
//     const d = getLunes(offset)
//     d.setDate(d.getDate() + 6)
//     return d
// }

// function formatFecha(d) {
//     return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
// }

// function actualizarFechas() {
//     document.querySelector('.fecha p').textContent =
//         `La semana seleccionada abarca de ${formatFecha(getLunes(semanaOffset))} (Lunes) a ${formatFecha(getDomingo(semanaOffset))} (Domingo)`
// }

// function limpiarTabla() {
//     bodyTablaDinamica.querySelectorAll('tr:not(#filaVacia)').forEach(f => f.remove())
//     document.getElementById('totalHoras').textContent = '0'
//     document.getElementById('filaVacia').style.display = 'table-row'
//     txtCodigo.value = ''
// }

// function recalcularTotal() {
//     let total = 0
//     bodyTablaDinamica.querySelectorAll('input.input-horas').forEach(inp => {
//         total += parseFloat(inp.value) || 0
//     })
//     document.getElementById('totalHoras').textContent = total % 1 === 0 ? total : total.toFixed(1)
// }

// function agregarFila(codigo, horas) {
//     document.getElementById('filaVacia').style.display = 'none'
//     const esCobrable = /^L\d{3}$/.test(codigo)
//     const fila = document.createElement('tr')
//     fila.className = codigo

//     let celdas = `<td class="celdas"><b>${codigo}</b>`

//     for (let d = 0; d < 7; d++) {
//         const val = horas ? (horas[d] || '') : ''
//         celdas += `<td class="celdas"><input class="input-horas" type="number" min="0" max="24" step="0.5"
//             value="${val}" placeholder="0"
//             style="width:48px;border:none;text-align:center;font-size:13px;background:transparent;outline:none;"
//             oninput="recalcularTotal()"></td>`
//     }

//     const totalFila = horas ? horas.reduce((a, b) => a + (b || 0), 0) : 0
//     celdas += `<td class="celdas celda-total">${totalFila}</td>`
//     celdas += `<td class="celdas"><button onclick="this.closest('tr').remove(); recalcularTotal(); 
//         if(!bodyTablaDinamica.querySelector('tr:not(#filaVacia)')) document.getElementById('filaVacia').style.display='table-row'">
//         Eliminar</button></td>`

//     fila.innerHTML = celdas
//     bodyTablaDinamica.appendChild(fila)
//     recalcularTotal()
// }

// Carga los registros del empleado desde la API
// async function cargarRegistros() {
//     limpiarTabla()
//     try {
//         const token = sessionStorage.getItem('token')
//         const usu   = sessionStorage.getItem('nUsu')
//         const fecha = getLunes(semanaOffset).toISOString().split('T')[0]

//         const respuesta = await fetch(`https://localhost:7293/api/RegistroJornada/${usu}?fechaInicio=${fecha}`, {
//             method: 'GET',
//             headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//         })

//         const datos = await respuesta.json()
//         datos.forEach(reg => agregarFila(reg.codigo, [reg.lunes, reg.martes, reg.miercoles, reg.jueves, reg.viernes, reg.sabado, reg.domingo]))

//     } catch {
//         console.log('ERROR CON LA API')
//     }
// }

// Botones de semana
// const btnsSemana = document.querySelectorAll('.btnSemanas')
// btnsSemana[0].addEventListener('click', () => { semanaOffset--; actualizarFechas(); cargarRegistros() })
// btnsSemana[1].addEventListener('click', () => { semanaOffset = 0; actualizarFechas(); cargarRegistros() })
// btnsSemana[2].addEventListener('click', () => { semanaOffset++; actualizarFechas(); cargarRegistros() })

// Boton agregar codigo
// document.getElementById('btnAgregar').addEventListener('click', () => {
//     const codigo = txtCodigo.value.trim().toUpperCase()

//     if (!codigo) { alert('Por favor, ingresa un código.'); return }
//     if (!/^[LM]\d{3}$/.test(codigo)) { alert('El código debe ser L o M seguido de 3 dígitos. Ej: L123 o M456.'); return }
//     if (bodyTablaDinamica.getElementsByClassName(codigo).length > 0) { alert(`El código ${codigo} ya fue agregado.`); return }

//     agregarFila(codigo, null)
//     txtCodigo.value = ''
// })

// Boton guardar
// document.querySelector('.btnGuardar').addEventListener('click', async () => {
//     const filas = bodyTablaDinamica.querySelectorAll('tr:not(#filaVacia)')
//     if (!filas.length) { alert('No hay registros para guardar.'); return }

//     const token = sessionStorage.getItem('token')
//     const usu   = sessionStorage.getItem('nUsu')
//     const registros = []

//     filas.forEach(fila => {
//         const inputs = fila.querySelectorAll('input.input-horas')
//         registros.push({
//             codigo:    fila.className,
//             lunes:     parseFloat(inputs[0].value) || 0,
//             martes:    parseFloat(inputs[1].value) || 0,
//             miercoles: parseFloat(inputs[2].value) || 0,
//             jueves:    parseFloat(inputs[3].value) || 0,
//             viernes:   parseFloat(inputs[4].value) || 0,
//             sabado:    parseFloat(inputs[5].value) || 0,
//             domingo:   parseFloat(inputs[6].value) || 0
//         })
//     })

//     try {
//         const respuesta = await fetch(`https://localhost:7293/api/RegistroJornada/${usu}`, {
//             method: 'POST',
//             headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//             body: JSON.stringify({ noUsuario: usu, fechaInicio: getLunes(semanaOffset).toISOString().split('T')[0], registros })
//         })

//         if (respuesta.ok) {
//             alert('Registros guardados exitosamente.')
//         } else {
//             alert('Error al guardar. Código: ' + respuesta.status)
//         }
//     } catch {
//         console.log('ERROR CON LA API')
//     }
// })

// document.addEventListener('DOMContentLoaded', () => { actualizarFechas(); cargarRegistros() })
