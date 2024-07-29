import "../App.css";
import { React, useState, useEffect} from "react";
import { useNavbarContext } from "./navbarProvider";


function Navbar() {
    // Contexto para navbProvider.
    const navContext = useNavbarContext();

    // --------------------------------------------
    // Recupero del token y el tipo de usuario para corroboración de sesión para la navbar.
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        setUser(sessionStorage.getItem("user"));
        setToken(sessionStorage.getItem("token"));
    }, []);

    const logOut = () => {
        sessionStorage.clear();
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
                                {
                                    (!token) &&
                                    <li><a className="dropdown-item" href="/crear-usuario"> Registrarse </a></li>
                                }
                                {
                                    (!token) &&
                                    <li><a className="dropdown-item" href="/login-usuario"> Iniciar Sesión </a></li>
                                }
                                {
                                    (token) &&
                                    <li><a className="dropdown-item" href="/" onClick={logOut}> Salir </a></li>
                                }
                                {
                                    (token) &&
                                    <li><hr className="dropdown-divider" /></li>
                                }
                                {
                                    (token && navContext.insumoKey) &&
                                    <div>
                                        <li><a className="dropdown-item" href="/productos"> Productos </a></li>
                                        {
                                            (user === "admin") &&
                                            <li><a className="dropdown-item" href="/admin/lista-usuarios"> Usuarios </a></li>
                                        }
                                    </div>
                                }
                                {
                                    (token && navContext.productoKey) &&
                                    <div>
                                        <li><a className="dropdown-item" href="/insumos"> Insumos </a></li>
                                        {
                                            (user === "admin") &&
                                            <li><a className="dropdown-item" href="/admin/lista-usuarios"> Usuarios </a></li>
                                        }
                                    </div>
                                }
                                {
                                    (token && navContext.allKey) &&
                                    <div>
                                        <li><a className="dropdown-item" href="/productos"> Productos </a></li>
                                        <li><a className="dropdown-item" href="/insumos"> Insumos </a></li>
                                        {
                                            (user === "admin") &&
                                            <li><a className="dropdown-item" href="admin/lista-usuarios"> Usuarios </a></li>
                                        }
                                    </div>
                                }
                                {
                                    (token && navContext.adminKey) &&
                                    <div>
                                        <li><a className="dropdown-item" href="/productos"> Productos </a></li>
                                        <li><a className="dropdown-item" href="/insumos"> Insumos </a></li>
                                    </div>
                                }
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;