import "../App.css"
import { React, useState, useEffect} from "react";


function Navbar() {
    // --------------------------------------------
    // Recupero del token para corroboración de sesión para la navbar.
    const [token, setToken] = useState(null);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    const logOut = () => {
        localStorage.clear()
    }
    // --------------------------------------------
    // Funcion para el menú desplegable.---------------------------------------------
    let [menuVisible, setMenuVisible] = useState("dropdown-menu dropdown-menu-end");
    let [menuActivo, setMenuActivo] = useState(false)
    const abrirMenu = () => {
        if (menuActivo === false) {
            setMenuVisible("dropdown-menu dropdown-menu-end show")
            setMenuActivo(true)
        } else {
            setMenuVisible("dropdown-menu dropdown-menu-end")
            setMenuActivo(false)
        }
    }
    //--------------------------------------------------------------------------------
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <a className="navbar-brand" href="/"> Stock Control </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {/* <li className="nav-item"><a className="nav-link active" aria-current="page" href="/">Inicio</a></li> */}
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" id="navbarDropdown" onClick={abrirMenu} role="button" data-bs-toggle="dropdown" aria-expanded="false">Menu </a>
                            <ul className={menuVisible} aria-labelledby="navbarDropdown">
                                <li><a className="dropdown-item" href="/crear-usuario">Registrarse</a></li>
                                <li><a className="dropdown-item" href="/login-usuario">Iniciar Sesión</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="/productos"> Productos </a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;