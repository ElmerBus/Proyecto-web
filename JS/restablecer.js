const lastPasswords = ["Pass124!!!1", "Admin476@@@", "Empresa769###"];
const username = "empleado123";

function hasSequential(str) {
      return /123|234|345|456|567|678|789|abc|bcd|cde/i.test(str);
}

function mark(id, condition) {
      document.getElementById(id).classList.toggle("ok", condition);
}

const contrasena = document.getElementById("newPass");
const confirmaContrasena = document.getElementById("confirmPass");

contrasena.addEventListener('input', ()=>{
      validatePassword()
})
confirmaContrasena.addEventListener('input', ()=>{
      validatePassword()
})

function validatePassword() {
      const pass = contrasena.value;
      const confirm = confirmaContrasena.value;

      const r1 = pass.length >= 12;
      const r2 = /[A-Z]/.test(pass) && /[a-z]/.test(pass);
      const r3 = (pass.match(/[0-9]/g) || []).length >= 3;
      const r4 = (pass.match(/[^A-Za-z0-9]/g) || []).length >= 3;
      const r5 = !hasSequential(pass);
      const r6 = !pass.toLowerCase().includes(username.toLowerCase());
      const r7 = !lastPasswords.includes(pass);

      mark("req1", r1);
      mark("req2", r2);
      mark("req3", r3);
      mark("req4", r4);
      mark("req5", r5);
      mark("req6", r6);
      mark("req7", r7);

      let score = [r1, r2, r3, r4, r5, r6, r7].filter(Boolean).length;
      const strength = document.getElementById("strengthText");

      if (score <= 3) strength.textContent = "Fortaleza: Baja";
      else if (score <= 5) strength.textContent = "Fortaleza: Media";
      else strength.textContent = "Fortaleza: Alta";

      const matchError = document.getElementById("matchError");
      const confirmInput = document.getElementById("confirmPass");

      let match = pass === confirm && confirm !== "";

      if (confirm && !match) {
            matchError.style.display = "block";
            confirmInput.classList.add("error");
            confirmInput.classList.remove("success");
      } else {
            matchError.style.display = "none";
            confirmInput.classList.remove("error");
            if (match) confirmInput.classList.add("success");
      }

      const valid = r1 && r2 && r3 && r4 && r5 && r6 && r7 && match;
      const btn = document.getElementById('updateBtn');

      btn.disabled = !valid;
      btn.classList.toggle("active", valid);
}

function updatePassword() {
      mostrarAlerta("Contraseña cambiada correctamente","exito")
      window.location.href = "login.html";
}