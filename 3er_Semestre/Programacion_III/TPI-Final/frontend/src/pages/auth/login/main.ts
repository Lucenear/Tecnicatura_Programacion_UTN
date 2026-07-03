import { getCollection } from "../../../utils/db";
import { saveUser } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";
import type { IUser } from "../../../types/IUser";
import { Rol } from "../../../types/Rol";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form") as HTMLFormElement;
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const users = getCollection<IUser>("usuarios");
    const mail = emailInput.value.trim();
    const pass = passwordInput.value.trim();
    const user = users.find(u => u.mail === mail && u.password === pass);

    if (user) {
      saveUser(user);
      if (user.rol === Rol.ADMIN || (user as any).role === "ADMIN") {
        navigate("/src/pages/admin/adminHome/index.html");
      } else {
        navigate("/src/pages/store/home/index.html");
      }
    } else {
      alert(`Credenciales incorrectas. Revisa tu correo y contraseña.`);
    }
  });


});
