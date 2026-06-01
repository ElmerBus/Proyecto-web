var totalcodigo = 0;
var totalgeneral = 0;


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


// ==================== VALIDACIONES ====================

function codigoEsValido(codigo) {
    return /^[LM]\d{3}$/.test(codigo);
}

function codigoYaExiste(codigo) {
    var tabla = document.getElementById("tablaRegistros");
    var filas = tabla.getElementsByTagName("tr");

    for (var i = 1; i < filas.length; i++) {
        if (filas[i].cells[0].textContent === codigo) {
            return true;
        }
    }
    return false;
}


// ==================== TABLA ====================

function hacerCeldaEditable(celda) {
    celda.addEventListener("click", function () {
        celda.textContent = "";
        celda.contentEditable = true;
        celda.addEventListener("keypress", function (e) {
            if (isNaN(e.key)) {
                e.preventDefault();
            }
        });
        //celda sin presionar
        celda.addEventListener("blur", function () {
            if (celda.textContent === "") {
                celda.textContent = "0";
            }
        });
    });
}

function agregarFila(codigo) {
    var tabla = document.getElementById("tablaRegistros");

    var filaVacia = document.getElementById("filaVacia");
    if (filaVacia) {
        tabla.deleteRow(filaVacia.rowIndex);
    }

    var nuevaFila = tabla.insertRow();
    nuevaFila.className = codigo;

    nuevaFila.insertCell(0).textContent = codigo;

    for (var i = 1; i <= 7; i++) {
        var celda = nuevaFila.insertCell(i);
        celda.textContent = "0";
        hacerCeldaEditable(celda);
    }

    nuevaFila.insertCell(8).textContent = "0";
    nuevaFila.insertCell(9).innerHTML = '<button class="btnEliminar">Eliminar</button>';
}


// ==================== BOTÓN AGREGAR ====================

document.getElementById("btnAgregar").addEventListener("click", function () {
    var codigo = document.getElementById("txtCodigo").value;

    if (codigo === "") {
        alert("Por favor, ingrese un código.");
        return;
    }

    // if (!codigoEsValido(codigo)) {
    //     alert("Código inválido. Debe tener el formato LXXX o MXXX.");
    //     return;
    // }

    if (codigoYaExiste(codigo)) {
        alert("El código " + codigo + " ya existe en la tabla.");
        return;
    }

    agregarFila(codigo);
});


// ==================== BOTÓN ELIMINAR ====================
document.getElementById("tablaRegistros").addEventListener("click", function (e) {
    if (e.target.classList.contains("btnEliminar")) {
        var fila = e.target.closest("tr");
        fila.parentNode.removeChild(fila);
    }

    //Agregar la fila por defecto si no hay registros
    var tabla = document.getElementById("tablaRegistros");
    if (tabla.rows.length === 1) {
        var filaVacia = tabla.insertRow();
        filaVacia.id = "filaVacia";
        var celda = filaVacia.insertCell(0);
        celda.colSpan = 10;
        celda.textContent = "Sin registros.";
    }

});

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


// ==================== GUARDAR REGISTROS ====================

function obtenerNoUsuarioDelToken() {
    const token = sessionStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    return parseInt(payload.sub);
}

async function guardarRegistros() {
    const periodoId = 2;
    const noUsuario = obtenerNoUsuarioDelToken();
    const token = sessionStorage.getItem('token');

    const tabla = document.getElementById("tablaRegistros");
    const filas = tabla.getElementsByTagName("tr");

    const hoy = new Date();
    const diffLunes = (hoy.getDay() + 6) % 7;
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - diffLunes);

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
                    noUsuario: noUsuario,
                    periodoId: periodoId,
                    codigo: codigo
                }
                console.log(datos)
                console.log(noUsuario)
                const respuesta = await fetch(`https://localhost:7293/api/RegistroJornada`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datos)
                })
                
                const resultado = await respuesta.json()
                console.log(resultado)
                if (!respuesta.ok) {
                    alert(resultado.message)
                    
                    return
                }
            }
        }
        alert("Registros guardados correctamente.")
    } catch (error) {
    console.error(error);
    alert("ERROR CON LA API");
}
}

document.querySelector(".btnGuardar").addEventListener("click", guardarRegistros);