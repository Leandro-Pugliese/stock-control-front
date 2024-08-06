import "../App.css";
import "./usuario.css";
import "../Productos/productos.css";
import { React, useState, useEffect} from "react";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Sidebar from "../Sidebar/sidebar";
import axios from "../axios"
import Mensajes from "../Componentes/mensajes";
import ShowPassword from "../Componentes/verPassword";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

function ListaUsuarios() {

    // Contexto para navbProvider.
    const navContext = useNavbarContext()
    useEffect(() => {
        navContext.cambiarKey("ADMIN");
    }, []);

    // Contexto para la sidebar.
    const sidebarKey = "ADMIN MENU";

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showErrorMsjPost, setShowErrorMsjPost] = useState(false);
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
            let msj = error.response.data;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(true);
            setShowMsj(false);
        }
    }
    useEffect(() => {
        getLista()
    }, []);

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
            setShowErrorMsjPost(false);
            setShowMsj(true);
            setBloqueoInput(false);
            setTimeout(function () {
                window.location.reload()
            }, 1300);
        } catch (error) {
            let msj = error.response.data;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(true);
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
            setShowErrorMsjPost(false);
            setShowMsj(true);
            setBloqueoInput(false);
            setTimeout(function () {
                window.location.reload()
            }, 1300);
        } catch (error) {
            let msj = error.response.data;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(true);
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
        setShowErrorMsjPost(false);
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

    return (
        <div className="container__main">
            <Sidebar 
                sidebarKey={sidebarKey}
            />
            <div className="container__general">
                <div className="listas__container">
                    <div className="lista__container">
                        <h4 className="titulo">Usuarios habilitados</h4>
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
                    <div className="lista__container">
                        <h4>Usuarios creados</h4>
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
                        <div className="close__container">
                            <button onClick={cerrarPopUp}>
                                <FontAwesomeIcon icon={faCircleXmark}/>
                            </button>
                        </div>
                        {
                            (bloqueoInput) &&
                            <div>
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
                                <div>
                                    {
                                        (bloqueo === true) &&
                                        <button className="bloquear__button boton1" onClick={bloquear}> Bloquear </button>
                                    }
                                    {
                                        (bloqueo === false) &&
                                        <button className="bloquear__button boton1" onClick={bloquear}> Desbloquear </button>
                                    }
                                </div>
                            </div>
                        }
                        <Mensajes
                            mensaje={mensaje}
                            showMsj={showMsj}
                            showErrorMsj={showErrorMsj}
                            showErrorMsjPost={showErrorMsjPost}
                        />
                    </div>
                </div>
            }
            {
                (popUpActivo2) &&
                <div className="popUp__overlay">
                    <div className="popUp">
                        <div className="close__container">
                            <button onClick={cerrarPopUp}>
                                <FontAwesomeIcon icon={faCircleXmark}/>
                            </button>
                        </div>
                        {
                            (bloqueoInput) &&
                            <div>
                                <div>¿Deshabilitar {usuarioEmail}?</div>
                                <div className="showPassword__container">
                                    <input onChange={onChangePin} className="login__input" id="pinInput" type={showPassword} placeholder="Pin..." />
                                    <ShowPassword
                                        botonShowPassword={botonShowPassword}
                                        verPassword={verPassword}
                                        hidePassword={hidePassword}
                                    />
                                </div>
                                <div> 
                                    <button className="bloquear__button boton1" onClick={deshabilitar}> Deshabilitar </button>
                                </div>
                            </div>
                        }
                        <Mensajes
                            mensaje={mensaje}
                            showMsj={showMsj}
                            showErrorMsj={showErrorMsj}
                            showErrorMsjPost={showErrorMsjPost}
                        />
                    </div>
                </div>
            }
        </div>
    );
}

export default ListaUsuarios;