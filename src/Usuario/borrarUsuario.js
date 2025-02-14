import "../App.css";
import "../general.css";
import { React, useState, useEffect} from "react";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Sidebar from "../Sidebar/sidebar";
import axios from "../axios"
import Mensajes from "../Componentes/mensajes";
import ShowPassword from "../Componentes/verPassword";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function BorrarUsuario() {
    // Chequeo si el usuario esta logueado o ingreso a la ruta sin iniciar sesión.
    const sesionIniciada = () => {
        const hayToken = sessionStorage.getItem("token");
        if (!hayToken) {
            window.location.href = "/";
        }
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
    const sidebarSubKey = "BORRAR-USUARIO";

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showMsj, setShowMsj] = useState(false);

    // Values de los inputs
    const [usuarioEmail, setUsuarioEmail] = useState("");
    const [passwordAdmin, setPasswordAdmin] = useState("");
    const [pin, setPin] = useState("");

    const onChangeUsuarioEmail = function (evento) {
        let email = evento.target.value.toLowerCase()
        setUsuarioEmail(email);
    };
    const onChangePasswordAdmin = function (evento) {
        setPasswordAdmin(evento.target.value);
    };
    const onChangePin = function (evento) {
        setPin(evento.target.value);
    };

    // Función para enviar petición a la api.
    const borrar = async () => {
        try {
            const tokenAxios = sessionStorage.getItem("token");
            const config = {
                method: "post",
                url: "/admin/borrar-usuario",
                json: true,
                data: {usuarioEmail, passwordAdmin, pin},
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
            setTimeout(function () {
                window.location.href = "/admin/lista-usuarios"
            }, 1200);
        } catch (error) {
            setMensaje(error.response.data);
            setShowErrorMsj(true);
            setShowMsj(false);
        }
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
            <div className="container__general" id="container__borrarUsuario">
                <h3 className="titulo"> Borrar usuario </h3>
                <div className="">
                    <input onChange={onChangeUsuarioEmail} className="login__input habilitarInput" id="emailInput" type="email" placeholder="Email usuario..."/>
                </div>
                <div className="showPassword__container">
                    <input onChange={onChangePasswordAdmin} className="login__input habilitarInput" id="passwordInput" type={showPassword} placeholder="Contraseña admin..."/>
                    <ShowPassword 
                        botonShowPassword={botonShowPassword}
                        verPassword={verPassword}
                        hidePassword={hidePassword}
                    />
                </div>
                <div className="">
                    <input onChange={onChangePin} className="login__input habilitarInput" id="pinInput" type={showPassword} placeholder="Pin..."/>
                </div>
                <div className="container__button">
                    <button id="boton__eliminar" onClick={borrar}> Borrar </button>
                </div>
                <Mensajes 
                    mensaje={mensaje}
                    showMsj={showMsj}
                    showErrorMsj={showErrorMsj}
                />
            </div>
        </div>
    );
}

export default BorrarUsuario;