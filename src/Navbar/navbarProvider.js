import { React, useState, createContext, useContext} from "react";

const navbarContext = createContext();

export function useNavbarContext() {
    return useContext(navbarContext)
}

export function NavbarProvider({children}) {

    // Keys para pasar contexto a la navbar.
    const [productoKey, setProductoKey] = useState(null)
    const [insumoKey, setInsumoKey] = useState(null)
    const [allKey, setAllKey] = useState(null)

    const cambiarKey = (indicador) => {
        if (indicador === "ALL") {
            setProductoKey(null);
            setInsumoKey(null);
            setAllKey(true);
        } else if (indicador === "PRODUCTO") {
            setProductoKey(true);
            setInsumoKey(null);
            setAllKey(null);
        } else if  (indicador === "INSUMO") {
            setProductoKey(null);
            setInsumoKey(true);
            setAllKey(null);
        }
    }

    return (
        <navbarContext.Provider value={{cambiarKey, productoKey, insumoKey, allKey}}>
            {children}
        </navbarContext.Provider>
    )
}
