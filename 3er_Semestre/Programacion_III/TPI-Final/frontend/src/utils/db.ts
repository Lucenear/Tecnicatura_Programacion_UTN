export const initDB = async (): Promise<void> => {
  const collections = ["usuarios", "categorias", "productos", "pedidos"];

  for (const collection of collections) {
    const existing = localStorage.getItem(collection);
    let shouldFetch = false;

    if (!existing || existing === "[]") {
      shouldFetch = true;
    } else if (collection === "usuarios") {

      const users = JSON.parse(existing);
      if (!users.some((u: any) => u.mail === "admin@admin.com")) {
        shouldFetch = true;
      }
    }

    if (shouldFetch) {
      try {
        const response = await fetch(`/data/${collection}.json`);
        const data = await response.json();
        localStorage.setItem(collection, JSON.stringify(data));
      } catch (error) {
        console.error(`Error loading ${collection}:`, error);
      }
    }
  }
};

export const getCollection = <T>(collectionName: string): T[] => {
  const data = localStorage.getItem(collectionName);
  return data ? JSON.parse(data) : [];
};

export const saveCollection = <T>(collectionName: string, data: T[]): void => {
  localStorage.setItem(collectionName, JSON.stringify(data));
};
