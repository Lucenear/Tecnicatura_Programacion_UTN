import { getCollection, saveCollection } from "../../../utils/db";
import { saveUser } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";
import type { IUser } from "../../../types/IUser";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form") as HTMLFormElement;
  
  const nombreInput = document.getElementById("nombre") as HTMLInputElement;
  const apellidoInput = document.getElementById("apellido") as HTMLInputElement;
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const celularInput = document.getElementById("celular") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const users = getCollection<IUser>("usuarios");
    
    if (users.some(u => u.mail === emailInput.value)) {
        alert("El correo ya está registrado.");
        return;
    }

    const newUser: IUser = {
        id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
        nombre: nombreInput.value,
        apellido: apellidoInput.value,
        mail: emailInput.value,
        celular: celularInput.value,
        password: passwordInput.value,
        rol: "USUARIO" as any
    };

    users.push(newUser);
    saveCollection("usuarios", users);
    
    saveUser(newUser);
    alert("Registro exitoso!");
    navigate("/src/pages/store/home/index.html");
  });
});
