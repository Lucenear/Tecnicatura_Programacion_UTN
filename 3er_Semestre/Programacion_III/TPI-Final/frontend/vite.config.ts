import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/auth/login/index.html"),
        register: resolve(__dirname, "src/pages/auth/register/index.html"),
        storeHome: resolve(__dirname, "src/pages/store/home/index.html"),
        storeDetail: resolve(__dirname, "src/pages/store/productDetail/index.html"),
        storeCart: resolve(__dirname, "src/pages/store/cart/index.html"),
        clientOrders: resolve(__dirname, "src/pages/client/orders/index.html"),
        adminHome: resolve(__dirname, "src/pages/admin/adminHome/index.html"),
        adminCategories: resolve(__dirname, "src/pages/admin/categories/index.html"),
        adminProducts: resolve(__dirname, "src/pages/admin/products/index.html"),
        adminOrders: resolve(__dirname, "src/pages/admin/orders/index.html"),
      },
    },
  },
  base: "./",
});
