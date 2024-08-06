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
    const [userKey, setUserKey] = useState(null);

    const cambiarKey = (indicador) => {
        if (indicador === "ALL") {
            setProductoKey(null);
            setInsumoKey(null);
            setAllKey(true);
            setAdminKey(null);
            setUserKey(null);
        } else if (indicador === "PRODUCTO") {
            setProductoKey(true);
            setInsumoKey(null);
            setAllKey(null);
            setAdminKey(null);
            setUserKey(null);
        } else if  (indicador === "INSUMO") {
            setProductoKey(null);
            setInsumoKey(true);
            setAllKey(null);
            setAdminKey(null);
            setUserKey(null);
        } else if  (indicador === "ADMIN") {
            setProductoKey(null);
            setInsumoKey(null);
            setAllKey(null);
            setAdminKey(true);
            setUserKey(null);
        }
        else if  (indicador === "USER") {
            setProductoKey(null);
            setInsumoKey(null);
            setAllKey(null);
            setAdminKey(null);
            setUserKey(true);
        }
    }
    return (
        <navbarContext.Provider value={{cambiarKey, allKey, productoKey, insumoKey, adminKey, userKey}}>
            {children}
        </navbarContext.Provider>
    )
}
