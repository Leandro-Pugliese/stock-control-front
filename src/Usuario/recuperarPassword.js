import "../App.css";
import "../general.css";
import axios from "../axios";
import { React, useEffect, useState} from "react";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Mensajes from "../Componentes/mensajes";

function RecuperarPassword() {
    //Verificación de sesión, si ya tengo la sesión iniciada no dejo que pueda recuperar la contraseña.
    const sesionIniciada = () => {
        const hayToken = sessionStorage.getItem("token");
        if (hayToken) {
            window.location.href = "/";
        }
    }
    // Contexto para navbProvider.
    const navContext = useNavbarContext()
    useEffect(() => {
        sesionIniciada();
        navContext.cambiarKey("ALL");
    // eslint-disable-next-line
    }, []);

    // Hook para email
    const [email, setEmail] = useState("");
    const onChangeEmail = function (evento) {
        setEmail(evento.target.value);
    };

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showMsj, setShowMsj] = useState(false);

    const recuperarPassword = async() => {
        try {
            const config = {
                method: "post",
                url: "/recuperar-password",
                json: true,
                data: {email},
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const response = await axios(config);
            setMensaje(response.data);
            setShowMsj(true);
            setShowErrorMsj(false);
        } catch (error) {
            setMensaje(error.response.data);
            setShowErrorMsj(true);
            setShowMsj(false);
        }
    }

    return (
        <div className="main__container">
            <div className="form__container" id="form__recuPassword">
                <h4 className="form__titulo">Recuperar contraseña</h4>
                <div className="recuperarPassword__container">
                    <input onChange={onChangeEmail} className="login__input" id="emailRecuInput" type="email" placeholder="Email..."/>
                </div>
                <div className="button-login__container">
                    <button className="button__ingresar" onClick={recuperarPassword}> Recuperar </button>
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

export default RecuperarPassword;