import { getUser } from "./utils/localStorage";
import { navigate } from "./utils/navigate";
import { Rol } from "./types/Rol";
import type { IUser } from "./types/IUser";

export const authGuard = (): void => {
  const userStr = getUser();
  const currentPath = window.location.pathname;
  const isAuthPage = currentPath.includes("login.html") || currentPath.includes("registro.html");

  if (!userStr && !isAuthPage) {
    navigate("/src/pages/auth/login/login.html");
    return;
  }

  if (userStr) {
    const user: IUser = JSON.parse(userStr);

    if (isAuthPage) {
      if (user.role === Rol.ADMIN) {
        navigate("/src/pages/admin/home/home.html");
      } else {
        navigate("/src/pages/client/home/home.html");
      }
      return;
    }

    if (currentPath.includes("/admin/") && user.role !== Rol.ADMIN) {
      navigate("/src/pages/client/home/home.html");
    }
  }
};

authGuard();
