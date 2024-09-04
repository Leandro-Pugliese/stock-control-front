import "../App.css";
import "../general.css";
import "../mobile.css";
import { React, useState, useEffect} from "react";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Sidebar from "../Sidebar/sidebar";
import axios from "../axios"
import Mensajes from "../Componentes/mensajes";
import ShowPassword from "../Componentes/verPassword";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faBars} from '@fortawesome/free-solid-svg-icons';

function ListaUsuarios() {
    // Chequeo si el usuario esta logueado o ingreso a la ruta sin iniciar sesión asi evito llamado a la BD.
    const [estadoSesion, setEstadoSesion] = useState(false)
    const sesionIniciada = () => {
        const hayToken = sessionStorage.getItem("token");
        if (!hayToken) {
            window.location.href = "/";
        }
        setEstadoSesion(true);
    }
    // Contexto para navbProvider.
    const navContext = useNavbarContext()
    useEffect(() => {
        sesionIniciada();
        navContext.cambiarKey("ADMIN");
    // eslint-disable-next-line
    }, []);
    // Contexto para la sidebar.
    const sidebarKey = "ADMIN MENU";
    // Sub Contexto para la sidebar.
    const sidebarSubKey = "LISTA-USUARIOS";

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showMsj, setShowMsj] = useState(false);

    // Values para mostrar info
    const [usuariosHabilitados, setUsuariosHabilitados] = useState([]);
    const [usuariosCreados, setUsuariosCreados] = useState([]);

    // Función para enviar petición a la api.
    const getLista = async () => {
        try {
            const tokenAxios = sessionStorage.getItem("token");
            const config = {
                method: "get",
                url: "/usuarios",
                json: true,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": tokenAxios,
                },
            };
            // llamado axios con la config lista.
            const response = await axios(config);
            let data = response.data;
            setUsuariosHabilitados(data.usuariosHabilitadosPorAdm);
            setUsuariosCreados(data.usuariosCreadosPorAdm);
        } catch (error) {
            setMensaje(error.response.data);
            setShowErrorMsj(true);
            setShowMsj(false);
        }
    }
    useEffect(() => {
        getLista()
    }, [estadoSesion]);

    // Hooks para pop up y userInfo.
    const [popUpActivo, setPopUpActivo] = useState(false);
    const [usuarioID, setUsuarioID] = useState("");
    const [username, setUsername] = useState("");
    const [bloqueo, setBloqueo] = useState(null);
    const [bloqueoInput, setBloqueoInput] = useState(true);

    const activarPopUpBloqueo = (indicador, userID, nombre) => {
        setPopUpActivo(true);
        if (indicador === true) {
            setBloqueo(true);
        } else {
            setBloqueo(false);
        }
        setUsername(nombre);
        setUsuarioID(userID);
    }

    // Value pin y usuarioID.
    const [pin, setPin] = useState("");
    const onChangePin = function (evento) {
        setPin(evento.target.value);
    };
    // Función para bloqueo de usuarios.
    const bloquear = async() => {
        try {
            const tokenAxios = sessionStorage.getItem("token");
            const config = {
                method: "put",
                url: "/admin/bloquear-usuario",
                json: true,
                data: {usuarioID, bloqueo, pin},
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": tokenAxios,
                },
            };
            // llamado axios con la config lista.
            const response = await axios(config);
            let data = response.data;
            setMensaje(data);
            setShowErrorMsj(false);
            setShowMsj(true);
            setBloqueoInput(false);
            setTimeout(function () {
                window.location.reload()
            }, 1300);
        } catch (error) {
            setMensaje(error.response.data);
            setShowErrorMsj(true);
            setShowMsj(false);
        }
    }

    // Hooks para deshabilitar ususario.
    const [popUpActivo2, setPopUpActivo2] = useState(false);
    const [usuarioEmail, setUsuarioEmail] = useState("");
    const activarPopUpDeshabilitar = (email) => {
        setPopUpActivo2(true);
        setUsuarioEmail(email);
    }

    // Función para deshabilitar usuarios. activarPopUpDeshabilitar
    const deshabilitar = async() => {
        try {
            const tokenAxios = sessionStorage.getItem("token");
            const config = {
                method: "put",
                url: "/admin/deshabilitar-usuario",
                json: true,
                data: {usuarioEmail, pin},
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": tokenAxios,
                },
            };
            // llamado axios con la config lista.
            const response = await axios(config);
            let data = response.data;
            setMensaje(data);
            setShowErrorMsj(false);
            setShowMsj(true);
            setBloqueoInput(false);
            setTimeout(function () {
                window.location.reload()
            }, 1300);
        } catch (error) {
            setMensaje(error.response.data);
            setShowErrorMsj(true);
            setShowMsj(false);
        }
    }

    // Cerrar popUp
    const cerrarPopUp = () => {
        setPopUpActivo(false);
        setBloqueo(null);
        setUsuarioID("");
        setPopUpActivo2(false);
        setUsuarioEmail("");
        setShowErrorMsj(false);
        setShowMsj(false);
    }

    //Hook para ver password
    const [showPassword, setShowPassword] = useState("password");
    const [botonShowPassword, setBotonShowPassword] = useState(true);
    const verPassword = () => {
        setShowPassword("text");
        setBotonShowPassword(false);
    };
    const hidePassword = () => {
        setShowPassword("password");
        setBotonShowPassword(true);
    };

    //Hooks para cambiar visualización de listas en mobile.
    const [indicador, setInidcador] = useState("HABILITADOS");
    const [verListaHabilitados, setListaHabilitados] = useState("lista__visible");
    const [verListaCreados, setListaCreados] = useState("lista__no-visible");
    const cambiarLista = (indicador) => {
        if (indicador === "HABILITADOS") {
            setInidcador("CREADOS");
            setListaHabilitados("lista__no-visible");
            setListaCreados("lista__visible");
        } else {
            setInidcador("HABILITADOS");
            setListaHabilitados("lista__visible");
            setListaCreados("lista__no-visible");
        }
    }

    //Hook para visualizar sidebar en mobile.
    const [estadoSidebar, setEstadoSidebar] = useState("sidebar sidebar__off");
    const [sidebarActiva, setsidebarActiva] = useState(false);
    const activarSidebar = (indicador) => {
        if (indicador === "ACTIVAR") {
            setEstadoSidebar("sidebar");
            setsidebarActiva(true);
        } else {
            setEstadoSidebar("sidebar sidebar__off");
            setsidebarActiva(false);
        }
    }

    return (
        <div className="container__main">
            {
                (!sidebarActiva) &&
                <button className="boton__activarSidebar" onClick={() => activarSidebar("ACTIVAR")}>
                    <FontAwesomeIcon className="activarSidebar__icono" icon={faBars} />
                </button>
            }
            {
                (sidebarActiva) &&
                <div className="layout__sidebarActiva" onClick={() => activarSidebar("-")}></div>
            }
            <Sidebar 
                sidebarKey={sidebarKey}
                sidebarSubKey={sidebarSubKey}
                estadoSidebar={estadoSidebar}
            />
            <div className="container__general" id="container__listaUsuarios">
                <div className="listas__container">
                    {/* La botonera solo es visible en css mobile */}
                    {
                        (indicador === "HABILITADOS") &&
                        <div className="botonera">
                            <p> 
                                Habilitados 
                                <FontAwesomeIcon className="botonera__icono" icon={faAngleDown}/>
                            </p>
                            <button className="boton__modificar" onClick={() => cambiarLista("HABILITADOS")}> Creados </button>
                        </div>
                    }
                    {
                        (indicador === "CREADOS") &&
                        <div className="botonera">
                            <button className="boton__modificar" onClick={() => cambiarLista("CREADOS")}> Habilitados </button>
                            <p> 
                                Creados 
                                <FontAwesomeIcon className="botonera__icono" icon={faAngleDown}/>
                            </p>
                        </div>
                    }
                    <div className="lista__container" id={verListaHabilitados}>
                        <h4 className="titulo"> Usuarios habilitados </h4>
                        {
                            usuariosHabilitados.map((elemento, indice) => (
                                <div className="datos__usuario" key={indice}> 
                                    <div className="dato">
                                        <div>Usuario:</div> 
                                        <div>{elemento.username}</div>
                                    </div>
                                    <div className="dato">
                                        <div>Email:</div>
                                        <div>{elemento.email}</div>
                                    </div>
                                    <div className="dato">
                                        <div>Clave de acceso:</div>
                                        <div>{elemento.claveAcceso}</div>
                                    </div>
                                    <button className="boton__modificar" id="botonDeshabilitar" onClick={() => activarPopUpDeshabilitar(elemento.email)}> Deshabilitar </button>
                                </div>
                            ))
                        }
                    </div>
                    <div className="lista__container" id={verListaCreados}>
                        <h4 className="titulo">Usuarios creados</h4>
                        {
                            usuariosCreados.map((elemento, indice) => (
                                <div className="datos__usuario" key={indice}> 
                                    <div className="dato">
                                        <div>Usuario:</div>
                                        <div>{elemento.username}</div> 
                                    </div>
                                    <div className="dato">
                                        <div>Email:</div>
                                        <div>{elemento.email}</div>
                                    </div>
                                    {
                                        (elemento.bloqueado === false) &&
                                        <div className="dato">
                                            <div>Bloqueado:</div>
                                            <div>No</div>
                                        </div>
                                    }
                                    {    
                                        (elemento.bloqueado === false) &&
                                        <div>
                                            <button className="boton__modificar" id="botonBloquear" onClick={() => activarPopUpBloqueo(true, elemento._id, elemento.username)}> Bloquear </button>
                                        </div>
                                    }
                                    {
                                        (elemento.bloqueado === true) &&
                                        <div className="dato">
                                            <div>Bloqueado:</div>
                                            <div>Si</div>
                                        </div>
                                    }
                                    {
                                        (elemento.bloqueado === true) &&
                                        <div>
                                            <button className="boton__modificar" id="botonDesbloquear" onClick={() => activarPopUpBloqueo(false, elemento._id, elemento.username)}> Desbloquear </button>
                                        </div>
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            {
                (popUpActivo) &&
                <div className="popUp__overlay">
                    <div className="popUp">
                        {
                            (bloqueoInput) &&
                            <div className="popUp__content">
                                <div>
                                {
                                    (bloqueo === true) &&
                                    <p>¿Bloquear a {username}?</p>
                                }
                                {
                                    (bloqueo === false) &&
                                    <p>¿Desbloquear a {username}?</p>
                                }
                                </div>
                                <div className="showPassword__container">
                                    <input onChange={onChangePin} className="login__input" id="pinInput" type={showPassword} placeholder="Pin..." />
                                    <ShowPassword
                                        botonShowPassword={botonShowPassword}
                                        verPassword={verPassword}
                                        hidePassword={hidePassword}
                                    />
                                </div>
                                <div className="buttonContainer__popUp">
                                    {
                                        (bloqueo === true) &&
                                        <button className="bloquear__button boton1" onClick={bloquear}> Bloquear </button>
                                    }
                                    {
                                        (bloqueo === false) &&
                                        <button className="bloquear__button boton1" onClick={bloquear}> Desbloquear </button>
                                    }
                                    <button className="cancelar__button boton1" onClick={cerrarPopUp}> Cancelar </button>
                                </div>
                            </div>
                        }
                        {
                            (showMsj || showErrorMsj) &&
                            <Mensajes
                                mensaje={mensaje}
                                showMsj={showMsj}
                                showErrorMsj={showErrorMsj}
                            />
                        }
                    </div>
                </div>
            }
            {
                (popUpActivo2) &&
                <div className="popUp__overlay">
                    <div className="popUp">
                        {
                            (bloqueoInput) &&
                            <div className="popUp__content">
                                <div>¿Deshabilitar {usuarioEmail}?</div>
                                <div className="showPassword__container">
                                    <input onChange={onChangePin} className="login__input" id="pinInput" type={showPassword} placeholder="Pin..." />
                                    <ShowPassword
                                        botonShowPassword={botonShowPassword}
                                        verPassword={verPassword}
                                        hidePassword={hidePassword}
                                    />
                                </div>
                                <div className="buttonContainer__popUp"> 
                                    <button className="bloquear__button boton1" onClick={deshabilitar}> Deshabilitar </button>
                                    <button className="cancelar__button boton1" onClick={cerrarPopUp}> Cancelar </button>
                                </div>
                            </div>
                        }
                        {
                            (showMsj || showErrorMsj) &&
                            <Mensajes
                                mensaje={mensaje}
                                showMsj={showMsj}
                                showErrorMsj={showErrorMsj}
                            />
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default ListaUsuarios;