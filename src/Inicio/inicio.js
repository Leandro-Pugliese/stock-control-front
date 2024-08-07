import "../App.css";
import "./inicio.css";
import { React, useEffect} from "react";
import { useNavbarContext } from "../Navbar/navbarProvider";
import logo from "../Imagenes/logoStockControl.jpg";

function Inicio() {
    // Contexto para navbProvider.
    const navContext = useNavbarContext()
    useEffect(() => {
        navContext.cambiarKey("ALL");
    // eslint-disable-next-line
    }, []);

    return (
        <div className="main__container-inicio">
            <div className="logo__inicio">
                <img src={logo} alt="Logo"/>
            </div>
            <div className="container__inicio">
                <div className="foto__container">
                    <div className="foto"></div>
                    <div className="texto__container">
                        Gestioná de manera eficiente el stock de tu negocio
                    </div>
                </div>
                <div className="foto__container">
                    <div className="foto2"></div>
                    <div className="texto__container">
                        Calculá costos y rentabilidades forma rápida y sencilla
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Inicio;