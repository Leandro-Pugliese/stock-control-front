import "../App.css";
import "./inicio.css";
import { React, useState, useEffect} from "react";
import { useNavbarContext } from "../Navbar/navbarProvider";

function Inicio() {

    // --------------------------------------------
    // Contexto para navbProvider.
    const navContext = useNavbarContext()
    
    useEffect(() => {
        navContext.cambiarKey("ALL");
    }, []);
    // --------------------------------------------

    return (
        <div className="main__container">
            <div>Inicio</div>
        </div>
    );
}

export default Inicio;