import "../App.css";
import "./insumos.css";
import { React, useState, useEffect} from "react";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Sidebar from "../Sidebar/sidebar";
import axios from "../axios"

function CrearInsumo() {

    // Contexto para navbProvider.
    const navContext = useNavbarContext()
    useEffect(() => {
        navContext.cambiarKey("INSUMO");
    }, []);

    // Contexto para la sidebar.
    const sidebarKey = "CREAR INSUMO";

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showErrorMsjPost, setShowErrorMsjPost] = useState(false);
    const [showMsj, setShowMsj] = useState(false);

    // Values de los inputs
    const [showInsumo, setShowInsumo] = useState(false);
    const [insumoCargado, setInsumoCargado] = useState({});
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState(0);
    const [descripcion, setDescripcion] = useState("");

    // Hooks para guardar y pasar input value al body del post.
    const onChangeNombre = function (evento) {
        setNombre(evento.target.value);
    };
    const onChangePrecio = function (evento) {
        let num = Number(evento.target.value);
        setPrecio(num);
    };
    const onChangeDescripcion = function (evento) {
        setDescripcion(evento.target.value);
    };

    const crearInsumo = async () => {
        try {
            if (nombre === "" || descripcion === "") {
                const msj = "Debes completar todos los campos.";
                setMensaje(msj);
                setShowErrorMsj(true);
                setShowErrorMsjPost(false);
                setShowMsj(false);
                return
            }
            if (precio <= 0) {
                const msj = "El precio nopuede ser menor o igual a cero.";
                setMensaje(msj);
                setShowErrorMsj(true);
                setShowErrorMsjPost(false);
                setShowMsj(false);
                return
            }
            // Verifico el tipo de usuario y cargo su token.
            const user = sessionStorage.getItem("user");
            const tokenAxios = sessionStorage.getItem("token");
            let config = {};
            // Armamos la config de axios para enviar la petición (varia si es un usuario o un administrador).
            if (user === "usuario") {
                config = {
                    method: "post",
                    url: "/insumo/crear",
                    json: true,
                    data: {nombre, precio, descripcion},
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": tokenAxios,
                    },
                };
            } else if (user === "admin") {
                config = {
                    method: "post",
                    url: "/insumo/crear-admin",
                    json: true,
                    data: {nombre, precio, descripcion},
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
            setMensaje(data.msj);
            setShowMsj(true);
            setInsumoCargado(data.insumo);
            setShowInsumo(true);
        } catch (error) {
            let msj = error.response.data;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(true);
            setShowMsj(false);
        }
    }

    return (
        <div className="container__main">
            <Sidebar 
                sidebarKey={sidebarKey}
            />
            <div className="container__general">
                <h3 className="titulo"> Cargar Insumo </h3>
                {
                    (!showInsumo) &&
                    <div>
                        <div className="">
                            <input onChange={onChangeNombre} className="" id="nombreInput" type="text" placeholder="Nombre..."/>
                        </div>
                        <div className="">
                            <input onChange={onChangePrecio} className="" id="precioInput" type="number" placeholder="Precio..."/>
                        </div>
                        <div className="">
                            <input onChange={onChangeDescripcion} className="" id="descripcionInput" type="text" placeholder="Descripción..."/>
                        </div>
                        <div className="">
                            <button onClick={crearInsumo}>Cargar</button>
                        </div>
                    </div>
                }
                {
                    (showErrorMsj) &&
                    <div>
                        <p>{mensaje}</p>
                    </div>
                }
                {
                    (showMsj) &&
                    <div>
                        <p>{mensaje}</p>
                    </div>
                }
                {
                    (showErrorMsjPost) &&
                    <div>
                        <p>{mensaje}</p>
                    </div>
                }
                {
                    (showInsumo) &&
                    <div>
                        <div>Insumo: {insumoCargado.nombre}</div>
                        <div>Precio: ${insumoCargado.precio}</div>
                        <div>Descripción: {insumoCargado.descripcion}</div>
                        <button onClick={() => window.location.reload()}>Cargar otro</button>
                    </div>
                }
            </div>
        </div>
    );
}

export default CrearInsumo;