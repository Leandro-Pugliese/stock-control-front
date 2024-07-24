import "../App.css";
import { useState, useEffect } from "react";
import axios from "../axios";


function CrearUsuario() {

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showErrorMsjPost, setShowErrorMsjPost] = useState(false);
    const [showMsj, setShowMsj] = useState(false);

    // Values de los inputs
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [claveAcceso, setClaveAcceso] = useState("");

    // Hooks para guardar y pasar input value al body del post.
    const onChangeUsername = function (evento) {
        setUsername(evento.target.value);
    };
    const onChangeEmail = function (evento) {
        setEmail(evento.target.value);
    };
    const onChangePassword = function (evento) {
        setPassword(evento.target.value);
    };
    const onChangePassword2 = function (evento) {
        setPassword2(evento.target.value);
    };
    const onChangeClaveAcceso = function (evento) {
        setClaveAcceso(evento.target.value);
    };

    // Función para enviar petición a la api.
    const crearUsuario = async () => {
        try {
            if (username === "" || email === "" || password === "" || password2 === "" || claveAcceso === "") {
                const msj = "¡Debes completar todos los campos!";
                setMensaje(msj);
                setShowErrorMsj(true);
                setShowErrorMsjPost(false);
                setShowMsj(false);
                return
            }
            if (password !== password2) {
                const msj = "¡Las contraseñas ingresadas no coinciden!";
                setMensaje(msj);
                setShowErrorMsj(true);
                setShowErrorMsjPost(false);
                setShowMsj(false);
                return
            }
            if (password.length <= 7 ) {
                const msj = "¡La contraseña debe tener al menos 8 caracteres!";
                setMensaje(msj);
                setShowErrorMsj(true);
                setShowErrorMsjPost(false);
                setShowMsj(false);
                return
            }
            // Armamos la config de axios para enviar la petición.
            const config = {
                method: "post",
                url: "/usuario/crear",
                json: true,
                data: { username, email, password, claveAcceso },
                headers: {
                  "Content-Type": "application/json",
                },
            };
            // llamado axios con la config lista.
            const response = await axios(config);
            //console.log(response);
            let msj = response.data.msj;
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
        <div className="main__container">
            <h3>Crear Usuario</h3>
            <div>
                <div className="">
                    <input onChange={onChangeUsername} className="" id="userInput" type="text" placeholder="Usuario..."/>
                </div>
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
                    <input onChange={onChangePassword2} className="" id="password2Input" type={showPassword} placeholder="Repita la contraseña..."/>
                </div>
                <div className="">
                    <input onChange={onChangeClaveAcceso} className="" id="claveAccesoInput" type={showPassword} placeholder="Clave Acceso..."/>
                </div>
                <div className="">
                    <button onClick={crearUsuario}> Registrar </button>
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

export default CrearUsuario;