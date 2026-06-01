var valortotal = 0;
var valorGeneral = 0;

//Datos de prueba
var empleados = [
    { numReloj: "1000001", nombre: "Juan Pérez" },
    { numReloj: "1000012", nombre: "María Gómez" },
    { numReloj: "1000154", nombre: "Carlos Sánchez" }
];

var datos = [
    { codigo: "L001", lunes: 8, martes: 8, miercoles: 8, jueves: 8, viernes: 8, sabado: 0, domingo: 0 },
    { codigo: "M002", lunes: 4, martes: 4, miercoles: 4, jueves: 4, viernes: 4, sabado: 0, domingo: 0 }
];

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
    // Limpiar todas las filas excepto el encabezado
    while (tabla.rows.length > 1) {
        tabla.deleteRow(1);
    }
    // Reiniciar contadores y etiquetas de horas
    valortotal = 0;
    valorGeneral = 0;
    document.getElementById("totalHoras").textContent = "0";
}

//Buscar empleado por número de reloj
document.getElementById("btnBuscar").addEventListener("click", function () {
    var numReloj = document.getElementById("txtNumReloj").value;
    if (numReloj === "") {
        alert("Por favor, ingresa un número de reloj.");
        return;
    }
    if (!verficarNumReloj(numReloj)) {
        return;
    }
    var empleado = empleados.find(emp => emp.numReloj === numReloj);
    if (empleado) {
        document.getElementById("txtNom").value = empleado.nombre;
        document.getElementById("txtNom").readOnly = true;
    } else {
        alert("Empleado no encontrado. Por favor, verifica el número de reloj.");
        document.getElementById("txtNom").value = "";
        document.getElementById("txtNom").readOnly = true;
    }

    var tabla = document.getElementById("tablaRegistros");
    // Limpiar tabla excepto encabezado
    while (tabla.rows.length > 1) {
        tabla.deleteRow(1);
    }

    // Agregar datos de prueba para el empleado encontrado
    if (empleado) {
        var nuevoRegistro = { codigo: "L001", lunes: 8, martes: 8, miercoles: 8, jueves: 8, viernes: 8, sabado: 0, domingo: 0 };
        var fila = tabla.insertRow();
        fila.insertCell(0).textContent = nuevoRegistro.codigo;
        fila.insertCell(1).textContent = nuevoRegistro.lunes;
        fila.cells[1].contentEditable = true;
        fila.insertCell(2).textContent = nuevoRegistro.martes;
        fila.cells[2].contentEditable = true;
        fila.insertCell(3).textContent = nuevoRegistro.miercoles;
        fila.cells[3].contentEditable = true;
        fila.insertCell(4).textContent = nuevoRegistro.jueves;
        fila.cells[4].contentEditable = true;
        fila.insertCell(5).textContent = nuevoRegistro.viernes;
        fila.cells[5].contentEditable = true;
        fila.insertCell(6).textContent = nuevoRegistro.sabado;
        fila.cells[6].contentEditable = true;
        fila.insertCell(7).textContent = nuevoRegistro.domingo;
        fila.cells[7].contentEditable = true;
        //fila total
        var totalHoras = nuevoRegistro.lunes + nuevoRegistro.martes + nuevoRegistro.miercoles + nuevoRegistro.jueves + nuevoRegistro.viernes + nuevoRegistro.sabado + nuevoRegistro.domingo;
        fila.insertCell(8).textContent = totalHoras;
        fila.insertCell(9).innerHTML = '<button class="btnEditar">Eliminar</button>';

        document.getElementById("totalHoras").textContent = totalHoras;
        document.getElementById("txtCodigo").readOnly = false;
        document.getElementById("txtCodigo").placeholder = "Ingresa un código";
    }
});

//Si cambia una celda, actualizar el total
document.getElementById("tablaRegistros").addEventListener("input", function (e) {
    if (e.target.tagName === "TD" && e.target.cellIndex > 0 && e.target.cellIndex < 8) {
        var fila = e.target.parentNode;
        valortotal = 0;
        for (var i = 1; i <= 7; i++) {
            var valor = parseInt(fila.cells[i].textContent) || 0;
            valortotal += valor;
        }
        fila.cells[8].textContent = valortotal;
    }
});

//Capturar nuevo código
var btnAgregar = document.getElementById("btnAgregar");
btnAgregar.addEventListener("click", function () {
    var codigo = document.getElementById("txtCodigo").value;

    if (!codigoEsValido(codigo)) {
        alert("El código no es válido. Debe tener el formato L001 o M001.");
        return;
    } else if (codigoYaExiste(codigo)) {
        alert("El código ya existe.");
        return;
    } else {
        agregarFila(codigo);
    }

});

function agregarFila(codigo) {
    var tabla = document.getElementById("tablaRegistros");
    var nuevaFila = tabla.insertRow();
    nuevaFila.insertCell(0).textContent = codigo;
    nuevaFila.insertCell(1).textContent = 0;
    nuevaFila.cells[1].contentEditable = true;
    nuevaFila.insertCell(2).textContent = 0;
    nuevaFila.cells[2].contentEditable = true;
    nuevaFila.insertCell(3).textContent = 0;
    nuevaFila.cells[3].contentEditable = true;
    nuevaFila.insertCell(4).textContent = 0;
    nuevaFila.cells[4].contentEditable = true;
    nuevaFila.insertCell(5).textContent = 0;
    nuevaFila.cells[5].contentEditable = true;
    nuevaFila.insertCell(6).textContent = 0;
    nuevaFila.cells[6].contentEditable = true;
    nuevaFila.insertCell(7).textContent = 0;
    nuevaFila.cells[7].contentEditable = true;
    nuevaFila.insertCell(8).textContent = 0;
    nuevaFila.insertCell(9).innerHTML = '<button class="btnEliminar">Eliminar</button>';
}

function codigoYaExiste(codigo) {
    var tabla = document.getElementById("tablaRegistros");
    for (var i = 1; i < tabla.rows.length; i++) {
        if (tabla.rows[i].cells[0].textContent === codigo) {
            return true;
        }
    }
    return false;
}

function codigoEsValido(codigo) {
    if (!/^[LM]\d{3}$/.test(codigo)) {
        return false;
    }
    return true;
}

document.getElementById("tablaRegistros").addEventListener("input", function (e) {
    if (e.target.tagName === "TD" && e.target.cellIndex >= 1 && e.target.cellIndex <= 7) {
        var fila = e.target.parentNode;
        var columna = e.target.cellIndex;
        var tabla = document.getElementById("tablaRegistros");
        var filas = tabla.getElementsByTagName("tr");

        // ---- Límite diario por columna (24h) ----
        var totalDiario = 0;
        for (var i = 1; i < filas.length; i++) {
            if (filas[i].cells.length > 8) {
                totalDiario += parseInt(filas[i].cells[columna].textContent) || 0;
            }
        }

        if (totalDiario > 24) {
            var exceso = totalDiario - 24;
            var valorActual = parseInt(e.target.textContent) || 0;
            var nuevoValor = valorActual - exceso;
            e.target.textContent = nuevoValor < 0 ? 0 : nuevoValor;
            alert("El total diario no puede superar las 24 horas. Se ajustó el valor a " + e.target.textContent + ".");
        }

        // ---- Recalcular total por fila ----
        totalcodigo = 0;
        for (var i = 1; i <= 7; i++) {
            totalcodigo += parseInt(fila.cells[i].textContent) || 0;
        }
        fila.cells[8].textContent = totalcodigo;

        // ---- Límite semanal (168h) ----
        totalgeneral = 0;
        for (var i = 1; i < filas.length; i++) {
            totalgeneral += parseInt(filas[i].cells[8].textContent) || 0;
        }

        if (totalgeneral > 168) {
            var exceso = totalgeneral - 168;
            var valorActual = parseInt(e.target.textContent) || 0;
            var nuevoValor = valorActual - exceso;
            e.target.textContent = nuevoValor < 0 ? 0 : nuevoValor;
            alert("El total semanal no puede superar las 168 horas. Se ajustó el valor a " + e.target.textContent + ".");

            // Recalcular total de fila después del ajuste
            totalcodigo = 0;
            for (var i = 1; i <= 7; i++) {
                totalcodigo += parseInt(fila.cells[i].textContent) || 0;
            }
            fila.cells[8].textContent = totalcodigo;

            // Recalcular total general después del ajuste
            totalgeneral = 0;
            for (var i = 1; i < filas.length; i++) {
                totalgeneral += parseInt(filas[i].cells[8].textContent) || 0;
            }
        }

        document.getElementById("totalHoras").textContent = totalgeneral;
    }
});

//Capturar valor general de cada codigo
document.getElementById("tablaRegistros").addEventListener("input", function (e) {
    if (e.target.tagName === "TD" && e.target.cellIndex > 0 && e.target.cellIndex < 8) {
        var tabla = document.getElementById("tablaRegistros");
        valorGeneral = 0;
        for (var i = 1; i < tabla.rows.length; i++) {
            if (tabla.rows[i].cells.length > 8) {
                valorGeneral += parseInt(tabla.rows[i].cells[8].textContent) || 0;
            }
        }
        document.getElementById("totalHoras").textContent = valorGeneral;
    }
});

function verficarNumReloj(numReloj) {
    if (!/^\d{7}$/.test(numReloj)) {
        alert("El número de reloj debe tener exactamente 7 dígitos.");
        return false;
    }
    return true;
};

