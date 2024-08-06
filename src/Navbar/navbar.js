import "../App.css";
import "./navbar.css";
import { React, useState, useEffect} from "react";
import { useNavbarContext } from "./navbarProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';


function Navbar() {
    // Contexto para navbProvider.
    const navContext = useNavbarContext();

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

    // Funcion para el menú desplegable.
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

    return (
        <nav>
            <a className="inicioButton" href="/"> Stock Control </a>
            <ul>
                <li>
                    <a className="openMenu" id="navbarDropdown" onClick={abrirMenu} role="button"> 
                        Menú 
                        <FontAwesomeIcon className="dropIcon" icon={faCaretDown}/>
                    </a>
                    <ul className={menuVisible}>
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
                                {
                                    (user === "usuario") &&
                                    <li><a className="dropdown-item" href="/usuario/update-password"> Mod. Contraseña </a></li>
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
                                {
                                    (user === "usuario") &&
                                    <li><a className="dropdown-item" href="/usuario/update-password"> Mod. Contraseña </a></li>
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
                                {
                                    (user === "usuario") &&
                                    <li><a className="dropdown-item" href="/usuario/update-password"> Mod. Contraseña </a></li>
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
                        {
                            (token && navContext.userKey) &&
                            <div>
                                <li><a className="dropdown-item" href="/productos"> Productos </a></li>
                                <li><a className="dropdown-item" href="/insumos"> Insumos </a></li>
                            </div>
                        }
                    </ul>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;