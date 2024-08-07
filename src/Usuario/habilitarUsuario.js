import "../App.css";
import "./usuario.css";
import "../Productos/productos.css";
import { React, useState, useEffect} from "react";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Sidebar from "../Sidebar/sidebar";
import axios from "../axios"
import Mensajes from "../Componentes/mensajes";
import ShowPassword from "../Componentes/verPassword";

function HabilitarUsuario() {
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
    const sidebarSubKey = "HABILITAR-USUARIO";

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showErrorMsjPost, setShowErrorMsjPost] = useState(false);
    const [showMsj, setShowMsj] = useState(false);

    // Values de los inputs
    const [usuarioNombre, setUsuarioNombre] = useState("");
    const [usuarioEmail, setUsuarioEmail] = useState("");
    const [claveAcceso, setClaveAcceso] = useState("");
    const [pin, setPin] = useState("");

    const onChangeUsuarioNombre = function (evento) {
        let usuario = evento.target.value.toUpperCase()
        setUsuarioNombre(usuario);
    };
    const onChangeUsuarioEmail = function (evento) {
        let email = evento.target.value.toLowerCase()
        setUsuarioEmail(email);
    };
    const onChangeClaveAcceso = function (evento) {
        setClaveAcceso(evento.target.value);
    };
    const onChangePin = function (evento) {
        setPin(evento.target.value);
    };

    // Función para enviar petición a la api.
    const habilitar = async () => {
        try {
            const tokenAxios = sessionStorage.getItem("token");
            const config = {
                method: "put",
                url: "/admin/habilitar-usuario",
                json: true,
                data: { usuarioNombre, usuarioEmail, claveAcceso, pin },
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": tokenAxios,
                },
            };
            // llamado axios con la config lista.
            const response = await axios(config);
            let data = response.data;
            let msj = data.msj;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(false);
            setShowMsj(true);
        } catch (error) {
            let msj = error.response.data;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(true);
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

    return (
        <div className="container__main">
            <Sidebar 
                sidebarKey={sidebarKey}
                sidebarSubKey={sidebarSubKey}
            />
            <div className="container__general">
                <h3 className="titulo"> Habilitar Usuario </h3>
                <div className="">
                    <input onChange={onChangeUsuarioNombre} className="login__input habilitarInput" id="nombreInput" type="text" placeholder="Usuario..."/>
                </div>
                <div className="">
                    <input onChange={onChangeUsuarioEmail} className="login__input habilitarInput" id="emailInput" type="email" placeholder="Email..."/>
                </div>
                <div className="">
                    <input onChange={onChangeClaveAcceso} className="login__input habilitarInput" id="claveInput" type="text" placeholder="Clave de acceso..."/>
                </div>
                <div className="showPassword__container">
                    <input onChange={onChangePin} className="login__input habilitarInput" id="pinInput" type={showPassword} placeholder="Pin..."/>
                    <ShowPassword 
                        botonShowPassword={botonShowPassword}
                        verPassword={verPassword}
                        hidePassword={hidePassword}
                    />
                </div>
                <div className="container__button">
                    <button onClick={habilitar}> Habilitar </button>
                </div>
                <Mensajes 
                    mensaje={mensaje}
                    showMsj={showMsj}
                    showErrorMsj={showErrorMsj}
                    showErrorMsjPost={showErrorMsjPost}
                />
            </div>
        </div>
    );
}

export default HabilitarUsuario;