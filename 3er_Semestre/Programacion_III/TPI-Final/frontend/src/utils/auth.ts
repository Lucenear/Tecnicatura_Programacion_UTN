import { navigate } from "./navigate";
import { removeUser } from "./localStorage";

export const logout = (): void => {
  removeUser();
  navigate("/src/pages/auth/login/login.html");
};
