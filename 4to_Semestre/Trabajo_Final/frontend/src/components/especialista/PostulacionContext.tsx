'use client';

import React, { createContext, useContext, useState } from 'react';
import { PostulacionModal } from './PostulacionModal';

interface PostulacionContextType {
  abrirModalPostulacion: () => void;
  cerrarModalPostulacion: () => void;
}

const PostulacionContext = createContext<PostulacionContextType>({
  abrirModalPostulacion: () => {},
  cerrarModalPostulacion: () => {},
});

export function PostulacionProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const abrirModalPostulacion = () => setIsOpen(true);
  const cerrarModalPostulacion = () => setIsOpen(false);

  return (
    <PostulacionContext.Provider value={{ abrirModalPostulacion, cerrarModalPostulacion }}>
      {children}
      <PostulacionModal isOpen={isOpen} onClose={cerrarModalPostulacion} />
    </PostulacionContext.Provider>
  );
}

export const usePostulacionModal = () => useContext(PostulacionContext);
