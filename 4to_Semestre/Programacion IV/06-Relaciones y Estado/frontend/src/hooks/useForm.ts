import { useState } from "react";
import type { ChangeEvent } from "react";

export function useForm<T>(initialState: T) {
  const [formData, setFormData] = useState<T>(initialState);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = (newValues?: T) => {
    setFormData(newValues ?? initialState);
  };

  return {
    formData,
    handleChange,
    resetForm,
    setFormData,
  };
}
