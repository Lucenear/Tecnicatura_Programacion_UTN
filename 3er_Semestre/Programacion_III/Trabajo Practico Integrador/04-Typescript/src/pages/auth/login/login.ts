import { Rol } from "../../../types/Rol";
import type { IUser } from "../../../types/IUser";
import { navigate } from "../../../utils/navigate";
import { getAllUsers, saveUser } from "../../../utils/localStorage";

const form = document.getElementById("form-login") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const email = inputEmail.value;
  const password = inputPassword.value;

  const users = getAllUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    const userData: IUser = {
      ...user,
      loggedIn: true,
    };
    delete userData.password;

    saveUser(userData);

    if (userData.role === Rol.ADMIN) {
      navigate("/src/pages/admin/home/home.html");
    } else {
      navigate("/src/pages/client/home/home.html");
    }
  } else {
    alert("Credenciales incorrectas");
  }
});
