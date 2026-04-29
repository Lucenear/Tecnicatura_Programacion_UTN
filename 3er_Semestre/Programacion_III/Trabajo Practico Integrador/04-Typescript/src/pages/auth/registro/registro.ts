import { Rol } from "../../../types/Rol";
import type { IUser } from "../../../types/IUser";
import { navigate } from "../../../utils/navigate";
import { getAllUsers, setAllUsers } from "../../../utils/localStorage";

const form = document.getElementById("form-registro") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const email = inputEmail.value;
  const password = inputPassword.value;

  const users = getAllUsers();
  const userExists = users.find((u) => u.email === email);

  if (userExists) {
    alert("El usuario ya existe");
    return;
  }

  const newUser: IUser = {
    email,
    password,
    role: Rol.CLIENT,
    loggedIn: false,
  };

  users.push(newUser);
  setAllUsers(users);

  alert("Registro exitoso.");
  navigate("../login/login.html");
});
