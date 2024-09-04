import "../App.css";
import "../general.css";
import axios from "../axios";
import { React, useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Mensajes from "../Componentes/mensajes";

function GenerarPassword() {
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

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showMsj, setShowMsj] = useState(false);

    const {id, token} = useParams()
    const generarPassword = async() => {
        try {
            const config = {
                method: "get",
                url: `/recuperar-password/${id}/${token}`,
                json: true,
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
                <h4 className="form__titulo">Generar contraseña</h4>
                <div className="recuperarPassword__container">
                    <p>Haz clic en <b>"GENERAR"</b> para crear una nueva contraseña.</p>
                </div>
                <div className="button-login__container">
                    <button className="button__ingresar" onClick={generarPassword}> Generar </button>
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

export default GenerarPassword;