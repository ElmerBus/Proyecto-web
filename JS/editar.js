if(sessionStorage.getItem("tipUsu")==="false"){
      window.location.href="../HTMl/login.html"
}

var valortotal = 0;
var valorGeneral = 0;

// ==================== SEMANAS ====================

function mostrarSemanas(offsetDias) {
    var mensajeSemana = document.getElementById("fechaSemana");
    var fechaActual = new Date();
    fechaActual.setDate(fechaActual.getDate() + offsetDias);

    var diaSemana = fechaActual.getDay();
    var diasHastaLunes = (diaSemana + 6) % 7;

    var fechaInicio = new Date(fechaActual);
    fechaInicio.setDate(fechaActual.getDate() - diasHastaLunes);

    var fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaInicio.getDate() + 6);

    mensajeSemana.textContent = "La semana actual es de " + fechaInicio.toLocaleDateString() + " a " + fechaFin.toLocaleDateString();
}
mostrarSemanas(0);

document.getElementsByClassName("btnSemanas")[0].addEventListener("click", function () {
    mostrarSemanas(-7);
    limpiarTablaYTotales();
});
document.getElementsByClassName("btnSemanas")[1].addEventListener("click", function () {
    mostrarSemanas(0);
    limpiarTablaYTotales();
});
document.getElementsByClassName("btnSemanas")[2].addEventListener("click", function () {
    mostrarSemanas(7);
    limpiarTablaYTotales();
});

function limpiarTablaYTotales() {
    var tabla = document.getElementById("tablaRegistros");
    while (tabla.rows.length > 1) {
        tabla.deleteRow(1);
    }
    valortotal = 0;
    valorGeneral = 0;
    document.getElementById("totalHoras").textContent = "0";
}

function obtenerLunesDeSemana(offsetDias = 0) {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + offsetDias);
    const diff = (hoy.getDay() + 6) % 7;
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - diff);
    return lunes;
}

// ==================== BUSCAR EMPLEADO + CARGAR REGISTROS ====================

document.getElementById("btnBuscar").addEventListener("click", async function () {
    var numReloj = document.getElementById("txtNumReloj").value;

    if (numReloj === "") {
        alert("Por favor, ingresa un número de reloj.");
        return;
    }
    if (!verficarNumReloj(numReloj)) {
        return;
    }

    const token = sessionStorage.getItem('token');

    try {
        // 1 — Buscar empleado
        const respuestaEmpleado = await fetch(`https://localhost:7293/api/Usuario/${numReloj}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const empleado = await respuestaEmpleado.json();

        if (!respuestaEmpleado.ok) {
            alert(empleado.message);
            document.getElementById("txtNom").value = "";
            return;
        }
        console.log(empleado.noUsuario,"esto")
        document.getElementById("txtNom").value = empleado.nombre_completo + " " + empleado.apPaterno;
        document.getElementById("txtNom").readOnly = true;
        document.getElementById("txtCodigo").readOnly = false;
        document.getElementById("txtCodigo").placeholder = "Ingresa un código";

        // 2 — Cargar registros de la semana
        limpiarTablaYTotales();

        const lunes = obtenerLunesDeSemana();
        const fechaInicio = lunes.toISOString().split('T')[0];

        const respuestaRegistros = await fetch(
            `https://localhost:7293/api/RegistroJornada/usuario/${numReloj}?fechaInicio=${fechaInicio}`,
            { headers: { "Authorization": `Bearer ${token}` } }
        );

        const registros = await respuestaRegistros.json();

        if (respuestaRegistros.ok && registros.length > 0) {
            cargarRegistrosEnTabla(registros, lunes);
        }

    } catch {
        alert("ERROR CON LA API");
    }
});

function cargarRegistrosEnTabla(registros, lunes) {
    // Agrupar por código
    const porCodigo = {};
    registros.forEach(r => {
        if (!porCodigo[r.codigo]) {
            porCodigo[r.codigo] = [0, 0, 0, 0, 0, 0, 0];
        }
        const fecha = new Date(r.fecha);
        const diffDia = Math.round((fecha - lunes) / (1000 * 60 * 60 * 24));
        if (diffDia >= 0 && diffDia <= 6) {
            porCodigo[r.codigo][diffDia] = r.horas;
        }
    });

    Object.entries(porCodigo).forEach(([codigo, dias]) => {
        agregarFilaConDatos(codigo, dias);
    });

    // Recalcular total general
    recalcularTotalGeneral();
}

// ==================== TABLA ====================

function agregarFila(codigo) {
    agregarFilaConDatos(codigo, [0, 0, 0, 0, 0, 0, 0]);
}

function agregarFilaConDatos(codigo, dias) {
    var tabla = document.getElementById("tablaRegistros");

    // Quitar filaVacia si existe
    var filaVacia = document.getElementById("filaVacia");
    if (filaVacia) filaVacia.remove();

    var nuevaFila = tabla.insertRow();
    nuevaFila.insertCell(0).textContent = codigo;

    for (var i = 0; i < 7; i++) {
        var celda = nuevaFila.insertCell(i + 1);
        celda.textContent = dias[i];
        celda.contentEditable = true;
    }

    var total = dias.reduce((a, b) => a + b, 0);
    nuevaFila.insertCell(8).textContent = total;
    nuevaFila.insertCell(9).innerHTML = '<button class="btnEliminar">Eliminar</button>';
}

function recalcularTotalGeneral() {
    var tabla = document.getElementById("tablaRegistros");
    var filas = tabla.getElementsByTagName("tr");
    valorGeneral = 0;
    for (var i = 1; i < filas.length; i++) {
        if (filas[i].cells.length > 8) {
            valorGeneral += parseInt(filas[i].cells[8].textContent) || 0;
        }
    }
    document.getElementById("totalHoras").textContent = valorGeneral;
}

// ==================== BOTÓN AGREGAR ====================

document.getElementById("btnAgregar").addEventListener("click", function () {
    var codigo = document.getElementById("txtCodigo").value;

    if (!codigoEsValido(codigo)) {
        alert("El código no es válido. Debe tener el formato L001 o M001.");
        return;
    }
    if (codigoYaExiste(codigo)) {
        alert("El código ya existe.");
        return;
    }
    agregarFila(codigo);
});

// ==================== BOTÓN ELIMINAR ====================

document.getElementById("tablaRegistros").addEventListener("click", function (e) {
    if (e.target.classList.contains("btnEliminar")) {
        e.target.closest("tr").remove();
        recalcularTotalGeneral();
    }
});

// ==================== VALIDACIONES INPUT ====================

document.getElementById("tablaRegistros").addEventListener("input", function (e) {
    if (e.target.tagName === "TD" && e.target.cellIndex >= 1 && e.target.cellIndex <= 7) {
        var fila = e.target.parentNode;
        var columna = e.target.cellIndex;
        var tabla = document.getElementById("tablaRegistros");
        var filas = tabla.getElementsByTagName("tr");

        // Límite diario (24h)
        var totalDiario = 0;
        for (var i = 1; i < filas.length; i++) {
            if (filas[i].cells.length > 8) {
                totalDiario += parseInt(filas[i].cells[columna].textContent) || 0;
            }
        }
        if (totalDiario > 24) {
            var exceso = totalDiario - 24;
            var valorActual = parseInt(e.target.textContent) || 0;
            e.target.textContent = Math.max(0, valorActual - exceso);
            alert("El total diario no puede superar las 24 horas. Se ajustó el valor a " + e.target.textContent + ".");
        }

        // Recalcular total fila
        valortotal = 0;
        for (var i = 1; i <= 7; i++) {
            valortotal += parseInt(fila.cells[i].textContent) || 0;
        }
        fila.cells[8].textContent = valortotal;

        // Límite semanal (168h)
        var totalgeneral = 0;
        for (var i = 1; i < filas.length; i++) {
            totalgeneral += parseInt(filas[i].cells[8].textContent) || 0;
        }
        if (totalgeneral > 168) {
            var exceso = totalgeneral - 168;
            var valorActual = parseInt(e.target.textContent) || 0;
            e.target.textContent = Math.max(0, valorActual - exceso);
            alert("El total semanal no puede superar las 168 horas. Se ajustó el valor a " + e.target.textContent + ".");

            valortotal = 0;
            for (var i = 1; i <= 7; i++) {
                valortotal += parseInt(fila.cells[i].textContent) || 0;
            }
            fila.cells[8].textContent = valortotal;

            totalgeneral = 0;
            for (var i = 1; i < filas.length; i++) {
                totalgeneral += parseInt(filas[i].cells[8].textContent) || 0;
            }
        }

        document.getElementById("totalHoras").textContent = totalgeneral;
    }
});

// ==================== GUARDAR REGISTROS ====================

async function guardarRegistros() {
    const numReloj = document.getElementById("txtNumReloj").value;
    if (!numReloj) {
        alert("Primero busca un empleado.");
        return;
    }

    const periodoId = 2; // hardcodeado por ahora
    const token = sessionStorage.getItem('token');
    const tabla = document.getElementById("tablaRegistros");
    const filas = tabla.getElementsByTagName("tr");

    const lunes = obtenerLunesDeSemana();

    try {
        for (let i = 1; i < filas.length; i++) {
            const fila = filas[i];
            if (fila.cells.length <= 8) continue;

            const codigo = fila.cells[0].textContent.trim();

            for (let d = 0; d < 7; d++) {
                const horas = parseInt(fila.cells[d + 1].textContent) || 0;
                if (horas === 0) continue;

                const fecha = new Date(lunes);
                fecha.setDate(lunes.getDate() + d);

                const datos = {
                    fecha: fecha.toISOString(),
                    horas: horas,
                    noUsuario: parseInt(numReloj),
                    periodoId: periodoId,
                    codigo: codigo
                }

                const respuesta = await fetch("https://localhost:7293/api/RegistroJornada", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datos)
                });

                const resultado = await respuesta.json();
                if (!respuesta.ok) {
                    alert(resultado.message);
                    return;
                }
            }
        }
        alert("Registros guardados correctamente.");
    } catch {
        alert("ERROR CON LA API");
    }
}

document.querySelector(".btnGuardar").addEventListener("click", guardarRegistros);

// ==================== VALIDACIONES ====================

function codigoYaExiste(codigo) {
    var tabla = document.getElementById("tablaRegistros");
    for (var i = 1; i < tabla.rows.length; i++) {
        if (tabla.rows[i].cells[0].textContent === codigo) return true;
    }
    return false;
}

function codigoEsValido(codigo) {
    return /^[LM]\d{3}$/.test(codigo);
}

function verficarNumReloj(numReloj) {
    if (!/^\d{7}$/.test(numReloj)) {
        alert("El número de reloj debe tener exactamente 7 dígitos.");
        return false;
    }
    return true;
}