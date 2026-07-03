import { createContext, useContext } from 'react';

/** Permite a cualquier componente de página cambiar de sección sin prop-drilling. */
export const NavContext = createContext<(seccion: string) => void>(() => {});
export const useNav = () => useContext(NavContext);
