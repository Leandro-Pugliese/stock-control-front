import "../App.css"
import { useState, useEffect } from "react";
import axios from "../axios"

function LoginAdmin() {

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showErrorMsjPost, setShowErrorMsjPost] = useState(false);
    const [showMsj, setShowMsj] = useState(false);

    // Values de los inputs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pin, setPin] = useState("");

    // Hooks para guardar y pasar input value al body del post.
    const onChangeEmail = function (evento) {
        setEmail(evento.target.value);
    };
    const onChangePassword = function (evento) {
        setPassword(evento.target.value);
    };
    const onChangePin = function (evento) {
        setPin(evento.target.value);
    };

    // Función para enviar petición a la api.
    const loginAdmin = async () => {
        try {
            if (email === "" || password === "" || pin === "") {
                const msj = "¡Debes completar todos los campos!";
                setMensaje(msj);
                setShowErrorMsj(true);
                setShowErrorMsjPost(false);
                setShowMsj(false);
                return
            }
            // Armamos la config de axios para enviar la petición.
            const config = {
                method: "post",
                url: "/admin/login",
                json: true,
                data: { email, password, pin },
                headers: {
                  "Content-Type": "application/json",
                },
            };
            // llamado axios con la config lista.
            const response = await axios(config);
            //console.log(response);
            let data = response.data;
            // Guardamos el token en session storage.
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user", "admin");
            // Armamos msj personalizado para el ususario.
            const msj = `Bienvenido ${data.admin.username}`;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(false);
            setShowMsj(true);
        } catch (error) {
            //console.log(error)
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
        <div>
            <p>Login Admin</p>
            <div>
                <div className="">
                    <input onChange={onChangeEmail} className="" id="emailInput" type="email" placeholder="Email..."/>
                </div>
                <div className="">
                    <input onChange={onChangePassword} className="" id="passwordInput" type={showPassword} placeholder="Contraseña..."/>
                    {(botonShowPassword) && 
                        <button className="eyeButton" onClick={verPassword}>
                            <i className="fa-solid fa-eye"></i>
                        </button>
                    }
                    {(!botonShowPassword) && 
                        <button className="eyeButton" onClick={hidePassword}>
                            <i className="fa-solid fa-eye-slash"></i>
                        </button>
                    }
                </div>
                <div className="">
                    <input onChange={onChangePin} className="" id="pinInput" type={showPassword} placeholder="Pin..."/>
                </div>
                <div className="">
                    <button onClick={loginAdmin}> Ingresar </button>
                </div>
            </div>
            {(showErrorMsj) &&
                <div>
                    <p>{mensaje}</p>
                </div>
            }
            {(showMsj) && 
                <div>
                    <p>{mensaje}</p>
                </div>
            }
            {(showErrorMsjPost) && 
                <div>
                    <p>{mensaje}</p>
                </div>
            }
        </div>
    );
}

export default LoginAdmin;