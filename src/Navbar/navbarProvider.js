import { React, useState, createContext, useContext} from "react";

const navbarContext = createContext();

export function useNavbarContext() {
    return useContext(navbarContext)
}

export function NavbarProvider({children}) {
    return (
        <navbarContext.Provider>
            {children}
        </navbarContext.Provider>
    )
}
