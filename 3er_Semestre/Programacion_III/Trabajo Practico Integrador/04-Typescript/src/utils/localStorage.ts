import type { IUser } from "../types/IUser";

export const saveUser = (user: IUser): void => {
  localStorage.setItem("userData", JSON.stringify(user));
};

export const getUser = (): string | null => {
  return localStorage.getItem("userData");
};

export const removeUser = (): void => {
  localStorage.removeItem("userData");
};

export const getAllUsers = (): IUser[] => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

export const setAllUsers = (users: IUser[]): void => {
  localStorage.setItem("users", JSON.stringify(users));
};
