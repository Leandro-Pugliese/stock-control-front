import "../App.css";
import { useState, useEffect } from "react";
import axios from "../axios";

function ListaProductos() {

    //-------------------------------------------------
    //Autenticación de sesión.
    const [token, setToken] = useState(null);

    useEffect(() => {
        setToken(sessionStorage.getItem("token"));
    },[])

    const logOut = () => {
        sessionStorage.clear()
    }
    //-------------------------------------------------

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showErrorMsjPost, setShowErrorMsjPost] = useState(false);
    const [showMsj, setShowMsj] = useState(false);
    
    // Hooks para info de la petición.
    const [productos, setProductos] = useState([]);

    // Función para enviar petición a la api.
    const listaProductos = async () => {
        try {
            // Verifico el tipo de usuario y cargo su token.
            const user = sessionStorage.getItem("user");
            const tokenAxios = sessionStorage.getItem("token");
            let config = {};
            // Armamos la config de axios para enviar la petición (varia si es un usuario o un administrador).
            if (user === "usuario") {
                config = {
                    method: "get",
                    url: "/productos",
                    json: true,
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": tokenAxios,
                    },
                };
            } else if (user === "admin") {
                config = {
                    method: "get",
                    url: "/productos-admin",
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
            //console.log(response);
            let data = response.data;
            setProductos(data);
            console.log(data);
        } catch (error) {
            //console.log(error)
            let msj = error.response.data;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(true);
            setShowMsj(false);
        }
    }

    useEffect(() => {
        listaProductos();
    },[])

    return (
        <div>
            <p> Lista Productos </p>
            {
                productos.map((element, index) => (
                    <div key={index}>
                        <p> SKU: {element.sku} </p>
                        <p> STOCK:</p> 
                        {
                            element.stock.map((elemento, indice) => (
                                <div key={indice}> 
                                    <p> {elemento.color} ({elemento.unidades})</p>
                                </div>
                            ))
                        }
                        <p> COMPONENTES: </p>
                        {
                            element.componentes.map((elemento, indice) => (
                                <div key={indice}> 
                                    <p> {elemento.insumo} ({elemento.cantidad})</p>
                                </div>
                            ))
                        }
                        <p> CATEGORÍA: {element.categoria} </p>
                        <p> DESCRIPCIÓN: {element.descripcion}</p>
                        <div>
                            <hr/>
                        </div>
                    </div>
                ))
            }
            <div>
            </div>
        </div>
    );
}

export default ListaProductos;