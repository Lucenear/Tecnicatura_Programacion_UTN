import { getUser } from "./utils/localStorage";
import { navigate } from "./utils/navigate";
import { Rol } from "./types/Rol";
import type { IUser } from "./types/IUser";

import { initDB } from "./utils/db";

export const authGuard = (): void => {
  const userStr = getUser();
  const currentPath = window.location.pathname;
  const isAuthPage = currentPath.includes("login") || currentPath.includes("register");

  if (!userStr && !isAuthPage) {
    navigate("/src/pages/auth/login/index.html");
    return;
  }

  if (userStr) {
    const user: IUser = JSON.parse(userStr);

    if (isAuthPage) {
      if (user.rol === Rol.ADMIN) {
        navigate("/src/pages/admin/adminHome/index.html");
      } else {
        navigate("/src/pages/store/home/index.html");
      }
      return;
    }

    if (currentPath.includes("/admin/") && user.rol !== Rol.ADMIN) {
      navigate("/src/pages/store/home/index.html");
    }
  }
};

const runApp = async () => {
  await initDB();
  authGuard();
};

runApp();
