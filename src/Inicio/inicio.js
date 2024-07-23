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
            <div className="container">
                <div className="text-center mt-5">
                    <h1>A Bootstrap 5 Starter Template</h1>
                    <p className="lead">A complete project boilerplate built with Bootstrap</p>
                    <p>Bootstrap v5.2.3</p>
                </div>
            </div>
        </div>
    );
}

export default Inicio;