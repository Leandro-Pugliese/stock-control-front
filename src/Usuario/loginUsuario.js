import "../App.css";
import "../general.css";
import { useState } from "react";
import axios from "../axios";
import Mensajes from "../Componentes/mensajes";
import ShowPassword from "../Componentes/verPassword";

function LoginUsuario() {

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showMsj, setShowMsj] = useState(false);

    // Values de los inputs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Hooks para guardar y pasar input value al body del post.
    const onChangeEmail = function (evento) {
        setEmail(evento.target.value);
    };
    const onChangePassword = function (evento) {
        setPassword(evento.target.value);
    };

    // Función para enviar petición a la api.
    const loginUsuario = async () => {
        try {
            if (email === "" || password === "") {
                setMensaje("¡Debes completar todos los campos!");
                setShowErrorMsj(true);
                setShowMsj(false);
                return
            }
            // Armamos la config de axios para enviar la petición.
            const config = {
                method: "post",
                url: "/usuario/login",
                json: true,
                data: { email, password },
                headers: {
                  "Content-Type": "application/json",
                },
            };
            // llamado axios con la config lista.
            const response = await axios(config);
            let data = response.data;
            // Guardamos el token en session storage.
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user", "usuario");
            // Armamos msj personalizado para el ususario.
            const msj = `Bienvenido ${data.user.username}, iniciaste sesión exitosamente.`;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowMsj(true);
            setTimeout(function () {
                window.location.href = "/"
              }, 800);
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
                <h3 className="form__titulo">Iniciar sesión</h3>
                <div>
                    <div className="">
                        <input onChange={onChangeEmail} className="login__input" id="emailInput" type="email" placeholder="Email..."/>
                    </div>
                    <div className="showPassword__container">
                        <input onChange={onChangePassword} className="login__input" id="passwordInput" type={showPassword} placeholder="Contraseña..."/>
                        <ShowPassword 
                            botonShowPassword={botonShowPassword}
                            verPassword={verPassword}
                            hidePassword={hidePassword}
                        />
                    </div>
                    <div className="linkForgotPasswordContainer">
                        <a href="/recuperar-pass">
                            <button className="linkForgotPassword"> ¿Olvidaste tu contraseña? </button>
                        </a>
                    </div>
                    <div className="button-login__container">
                        <button className="button__ingresar" onClick={loginUsuario}> Ingresar </button>
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

export default LoginUsuario;