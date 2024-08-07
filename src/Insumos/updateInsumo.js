import "../App.css";
import "./insumos.css";
import "../Productos/productos.css"
import { React, useState, useEffect} from "react";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Sidebar from "../Sidebar/sidebar";
import axios from "../axios";
import Mensajes from "../Componentes/mensajes";

function UpdateInsumo() {
    // Chequeo si el usuario esta logueado o ingreso a la ruta sin iniciar sesión asi evito llamado a la BD.
    const [estadoSesion, setEstadoSesion] = useState(false)
    const sesionIniciada = () => {
        const hayToken = sessionStorage.getItem("token");
        if (!hayToken) {
            window.location.href = "/";
        }
        setEstadoSesion(true);
    }
    // Contexto para navbProvider.
    const navContext = useNavbarContext()
    useEffect(() => {
        sesionIniciada();
        navContext.cambiarKey("INSUMO");
    // eslint-disable-next-line
    }, []);

    // Contexto para la sidebar.
    const sidebarKey = "UPDATE INSUMO";

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showErrorMsjPost, setShowErrorMsjPost] = useState(false);
    const [showMsj, setShowMsj] = useState(false);

    // Values de los inputs
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState(0);
    const [descripcion, setDescripcion] = useState("");

    //Obtenemos el ID del storage antes de buscar el insumo.
    const [_id, setId] = useState("");
    const [idCargado, setIdCargado] = useState(false);
    const getIdData = () => {
        setId(sessionStorage.getItem("insumoID"));
        setIdCargado(true)
    }
    useEffect(() => {
        getIdData();
    }, [estadoSesion]);
    useEffect(() => {
        insumoData();
        // eslint-disable-next-line
    }, [idCargado]);

    //Data del producto para ver descripción y categoría.
    const insumoData = async () => {
        try {
            // Atajamos el error cuando se ejecuta la primera vez, por si no llega a cargar el id antes de enviar la petición.
            if (_id === "") {
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
                    url: "/insumo",
                    json: true,
                    data: {_id},
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": tokenAxios,
                    },
                };
            } else if (user === "admin") {
                config = {
                    method: "post",
                    url: "/insumo-admin",
                    json: true,
                    data: {_id},
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
            setNombre(data.nombre)
            setPrecio(data.precio);
            setDescripcion(data.descripcion);
        } catch (error) {
            let msj = error.response.data;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(true);
            setShowMsj(false);
        }
    } 

    // Hooks para guardar y pasar input value.
    const onChangePrecio = function (evento) {
        let num = Number(evento.target.value);
        setPrecio(num);
    };
    const onChangeDescripcion = function (evento) {
        setDescripcion(evento.target.value);
    };

    // Update insumo.
    const [anularBoton, setAnularBoton] = useState(true);
    const updateInsumo = async () => {
        try {
            if (descripcion === "") {
                const msj = "Debes completar todos los campos.";
                setMensaje(msj);
                setShowErrorMsj(true);
                setShowErrorMsjPost(false);
                setShowMsj(false);
                return
            }
            if (precio <= 0) {
                const msj = "El precio no puede ser menor o igual a cero.";
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
                    method: "put",
                    url: "/insumo/update",
                    json: true,
                    data: {_id ,precio, descripcion},
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": tokenAxios,
                    },
                };
            } else if (user === "admin") {
                config = {
                    method: "put",
                    url: "/insumo/update-admin",
                    json: true,
                    data: {_id, precio, descripcion},
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
            setMensaje(data);
            setShowMsj(true);
            setShowErrorMsj(false);
            setShowErrorMsjPost(false);
            setAnularBoton(true);
            setTimeout(function () {
                window.location.href = "/insumos"
              }, 800);
        } catch (error) {
            let msj = error.response.data;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(true);
            setShowMsj(false);
        }
    }

    // Botones para modifcar solo lo que necesites.
    const [modPrecio, setModPrecio] = useState(false);
    const [modDescripcion, setModDescripcion] = useState(false);
    const habilitarModificarInput = (inputTipo) => {
        if (inputTipo === "Precio") {
            setModPrecio(prevState => !prevState);
            setPrecio(0);
            setAnularBoton(false); // Solo muestro el boton para hacer el update si el ususario quiere modificar algo.
        } else if (inputTipo === "Descripcion") {
            setModDescripcion(prevState => !prevState);
            setDescripcion("");
            setAnularBoton(false); 
        }
    }

    // Función para formatear número a moneda.
    const formateoMoneda = (valor) => {
        return valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    }

    return (
        <div className="container__main">
            <Sidebar 
                sidebarKey={sidebarKey}
            />
            <div className="container__general">
                <h3 className="titulo"> Modificar </h3>
                <div className="stock__sku">Insumo: {nombre}</div>
                <div className="modificable__container">
                    <div className="data__modificable">
                        <label>
                            Precio
                        </label>
                        {
                            (!modPrecio) &&
                            <div className="modificable">
                                <p>{formateoMoneda(precio)}</p>
                                <button className="boton__modificar" onClick={() => habilitarModificarInput("Precio")}>Modificar</button>
                            </div>
                        }
                        {
                            (modPrecio) &&
                            <div className="container__input">
                                <input onChange={onChangePrecio} className="input__insumo" id="precioInput" type="number" placeholder="Precio..." />
                            </div>
                        }
                    </div>
                </div>
                <div className="modificable__container">
                    <div className="data__modificable">
                        <label>
                            Descripción
                        </label>
                        {
                            (!modDescripcion) &&
                            <div className="modificable">
                                <p>{descripcion}</p>
                                <button className="boton__modificar" onClick={() => habilitarModificarInput("Descripcion")}>Modificar</button>
                            </div>
                        }
                        {
                            (modDescripcion) &&
                            <div className="container__input">
                                <input onChange={onChangeDescripcion} className="input__insumo" id="precioInput" type="text" placeholder="Descripción..." />
                            </div>
                        }
                    </div>
                </div>
                {
                    (!anularBoton) &&
                    <div className="">
                        <button className="boton1" id="botonAceptar" onClick={updateInsumo}> Aceptar </button>
                        <button className="boton1" id="botonCancelar" onClick={() => window.location.reload()}> Atras </button>
                    </div>
                }
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

export default UpdateInsumo;