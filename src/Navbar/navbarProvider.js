import { React, useState, createContext, useContext} from "react";

const navbarContext = createContext();

export function useNavbarContext() {
    return useContext(navbarContext)
}

export function NavbarProvider({children}) {

    // Keys para pasar contexto a la navbar.
    const [productoKey, setProductoKey] = useState(null);
    const [insumoKey, setInsumoKey] = useState(null);
    const [allKey, setAllKey] = useState(null);
    const [adminKey, setAdminKey] = useState(null);

    const cambiarKey = (indicador) => {
        if (indicador === "ALL") {
            setProductoKey(null);
            setInsumoKey(null);
            setAllKey(true);
            setAdminKey(null);
        } else if (indicador === "PRODUCTO") {
            setProductoKey(true);
            setInsumoKey(null);
            setAllKey(null);
            setAdminKey(null);
        } else if  (indicador === "INSUMO") {
            setProductoKey(null);
            setInsumoKey(true);
            setAllKey(null);
            setAdminKey(null);
        } else if  (indicador === "ADMIN") {
            setProductoKey(null);
            setInsumoKey(null);
            setAllKey(null);
            setAdminKey(true);
        }
    }
    return (
        <navbarContext.Provider value={{cambiarKey, productoKey, insumoKey, allKey, adminKey}}>
            {children}
        </navbarContext.Provider>
    )
}
