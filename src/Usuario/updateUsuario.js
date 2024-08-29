import "../App.css"
import "../general.css"
import { useState, useEffect } from "react";
import axios from "../axios";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Mensajes from "../Componentes/mensajes";
import ShowPassword from "../Componentes/verPassword";

function UpdatePasswordUsuario() {
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
        navContext.cambiarKey("USER");
        // eslint-disable-next-line
    }, []);
    
    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showMsj, setShowMsj] = useState(false);

    // Values de los inputs
    const [email, setEmail] = useState("");
    const [passwordActual, setPasswordActual] = useState("");
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [nuevaPassword2, setNuevaPassword2] = useState("");

    // Hooks para guardar y pasar input value al body del post.
    const onChangeEmail = function (evento) {
        setEmail(evento.target.value);
    };
    const onChangePasswordActual = function (evento) {
        setPasswordActual(evento.target.value);
    };
    const onChangeNuevaPassword = function (evento) {
        setNuevaPassword(evento.target.value);
    };
    const onChangeNuevaPassword2 = function (evento) {
        setNuevaPassword2(evento.target.value);
    };

    // Función para enviar petición a la api.
    const updatePassword = async () => {
        try {
            if (email === "" || passwordActual === "" || nuevaPassword === "" || nuevaPassword2 === "") {
                setMensaje("¡Debes completar todos los campos!");
                setShowErrorMsj(true);
                setShowMsj(false);
                return
            }
            if (nuevaPassword !== nuevaPassword2) {
                setMensaje( "¡Las contraseñas nuevas no coinciden!");
                setShowErrorMsj(true);
                setShowMsj(false);
                return
            }
            if (nuevaPassword.length <= 7) {
                setMensaje("¡La contraseña debe tener al menos 8 caracteres!");
                setShowErrorMsj(true);
                setShowMsj(false);
                return
            }
            // Armamos la config de axios para enviar la petición.
            const tokenAxios = sessionStorage.getItem("token");
            const config = {
                method: "put",
                url: "/usuario/update",
                json: true,
                data: {email, passwordActual, nuevaPassword},
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
                window.location.href = "/"
            }, 1000);
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

    return (
        <div className="main__container">
            <div className="form__container">
                <h3 className="form__titulo">Mod. Contraseña</h3>
                <div>
                    <div className="">
                        <input onChange={onChangeEmail} className="login__input" id="emailInput" type="email" placeholder="Email..."/>
                    </div>
                    <div className="showPassword__container">
                        <input onChange={onChangePasswordActual} className="login__input" id="passwordInput" type={showPassword} placeholder="Contraseña actual..."/>
                        <ShowPassword 
                            botonShowPassword={botonShowPassword}
                            verPassword={verPassword}
                            hidePassword={hidePassword}
                        />
                    </div>
                    <div className="">
                        <input onChange={onChangeNuevaPassword} className="login__input" id="passInput" type={showPassword} placeholder="Nueva contraseña..."/>
                    </div>
                    <div className="">
                        <input onChange={onChangeNuevaPassword2} className="login__input" id="pass2Input" type={showPassword} placeholder="Repetir nueva contraseña..."/>
                    </div>
                    <div className="button-login__container">
                        <button className="button__ingresar" id="boton__updatePassword" onClick={updatePassword}> Modificar </button>
                    </div>
                </div>
            </div>
            <Mensajes 
                mensaje={mensaje}
                showMsj={showMsj}
                showErrorMsj={showErrorMsj}
            />
        </div>
    );
}

export default UpdatePasswordUsuario;