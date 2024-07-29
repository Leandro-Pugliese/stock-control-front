import "../App.css";
import "./insumos.css";
import { React, useState, useEffect} from "react";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Sidebar from "../Sidebar/sidebar";
import axios from "../axios";
import Mensajes from "../Componentes/mensajes";

function ListaInsumos() {

    // Contexto para navbProvider.
    const navContext = useNavbarContext()
    useEffect(() => {
        navContext.cambiarKey("INSUMO");
    }, []);

    // Contexto para la sidebar.
    const sidebarKey = "LISTA INSUMOS";

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showErrorMsjPost, setShowErrorMsjPost] = useState(false);
    const [showMsj, setShowMsj] = useState(false);

    // Values para mostrar.
    const [insumos, setInsumos] = useState([]);

    // Función para enviar petición a la api.
    const insumosLista = async () => {
        try {
            // Verifico el tipo de usuario y cargo su token.
            const user = sessionStorage.getItem("user");
            const tokenAxios = sessionStorage.getItem("token");
            let config = {};
            // Armamos la config de axios para enviar la petición (varía si es un usuario o un administrador).
            if (user === "usuario") {
                config = {
                    method: "get",
                    url: "/insumos",
                    json: true,
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": tokenAxios,
                    },
                };
            } else if (user === "admin") {
                config = {
                    method: "get",
                    url: "/insumos-admin",
                    json: true,
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": tokenAxios,
                    },
                };
            } else {
                const msj = `Error: No se detecto el formato de usuario.`;
                setMensaje(msj);
                setShowErrorMsj(true);
                setShowErrorMsjPost(false);
                setShowMsj(true);
                return
            }
            // llamado axios con la config lista.
            const response = await axios(config);
            let data = response.data;
            setInsumos(data);
        } catch (error) {
            let msj = error.response.data;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(true);
            setShowMsj(false);
        }
    }

    useEffect(() => {
        insumosLista()
    },[])

    const modificarInsumo = (_id) => {
        sessionStorage.setItem("insumoID", _id);
        window.location.href = "/update-insumo"
    }

    
    return (
        <div className="container__main">
            <Sidebar 
                sidebarKey={sidebarKey}
            />
            <div className="container__general">
                <h3 className="titulo"> Lista Insumos </h3>
                {
                    insumos.map((elemento, indice) => (
                        <div className="" key={indice}> 
                            <div>Insumo: {elemento.nombre}</div> 
                            <div>Precio: ${elemento.precio}</div>
                            <div>Descripción: {elemento.descripcion}</div>
                            <button onClick={() => modificarInsumo(elemento._id)}>Modificar</button>
                            <hr/>
                        </div>
                    ))
                }
            </div>
            <Mensajes 
                mensaje={mensaje}
                showMsj={showMsj}
                showErrorMsj={showErrorMsj}
                showErrorMsjPost={showErrorMsjPost}
            />
        </div>
    );
}

export default ListaInsumos;