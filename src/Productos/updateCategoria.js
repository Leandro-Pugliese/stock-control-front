import "../App.css";
import "./productos.css";
import { React, useState, useEffect} from "react";
import axios from "../axios";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Sidebar from "../Sidebar/sidebar";
import Mensajes from "../Componentes/mensajes";

function UpdateCategoria() {
    // Chequeo si el usuario esta logueado o ingreso a la ruta sin iniciar sesión.
    const sesionIniciada = () => {
        const hayToken = sessionStorage.getItem("token");
        console.log(hayToken)
        if (!hayToken) {
            window.location.href = "/";
        }
    }
    // Contexto para navbProvider.
    const navContext = useNavbarContext()
    useEffect(() => {
        navContext.cambiarKey("PRODUCTO");
        sesionIniciada();
    // eslint-disable-next-line
    }, []);

    // Contexto para la sidebar
    const sidebarKey = "UPDATE PRODUCTO";

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showErrorMsjPost, setShowErrorMsjPost] = useState(false);
    const [showMsj, setShowMsj] = useState(false);

    // Hooks para value inputs
    const [sku, setSku] = useState("");
    const [categoria, setCategoria] = useState("");
    const [descripcion, setDescripcion] = useState("");
    
    //Obtenemos el sku del storage antes de buscar el producto para ver su stock.
    const [skuCargado, setSkuCargado] = useState(false);
    const setSkuData = () => {
        setSku(sessionStorage.getItem("skuModificar"));
        setSkuCargado(true)
    }
    useEffect(() => {
        setSkuData();
    }, []);
    useEffect(() => {
        productoData();
        // eslint-disable-next-line
    }, [skuCargado]);

    const onChangeCategoria = function (evento) {
        setCategoria(evento.target.value);
    };
    const onChangeDescripcion = function (evento) {
        setDescripcion(evento.target.value);
    };
    
    //Data del producto para ver descripción y categoría.
    const productoData = async () => {
        try {
            // Atajamos el error cuando se ejecuta la primera vez, por si no llega a cargar el sku antes de enviar la petición.
            if (sku === "") {
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
                    url: "/producto",
                    json: true,
                    data: {sku},
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": tokenAxios,
                    },
                };
            } else if (user === "admin") {
                config = {
                    method: "post",
                    url: "/producto-admin",
                    json: true,
                    data: {sku},
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
            setCategoria(data.categoria);
            setDescripcion(data.descripcion);
        } catch (error) {
            let msj = error.response.data;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(true);
            setShowMsj(false);
        }
    } 
    
    // Update del producto.
    const [anularBoton, setAnularBoton] = useState(true);
    const updateCategoria = async () => {
        try {
            if (categoria === "" || descripcion === "") {
                const msj = "Debes completar todos los campos.";
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
                    url: "/producto/update-categoria",
                    json: true,
                    data: {sku, categoria, descripcion},
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": tokenAxios,
                    },
                };
            } else if (user === "admin") {
                config = {
                    method: "put",
                    url: "/producto/update-categoria-admin",
                    json: true,
                    data: {sku, categoria, descripcion},
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
            setShowErrorMsj(false);
            setShowErrorMsjPost(false);
            setShowMsj(true);
            setAnularBoton(true);
            setTimeout(function () {
                window.location.href = "/productos"
              }, 1000);
        } catch (error) {
            let msj = error.response.data;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(true);
            setShowMsj(false);
        }
    } 

    // Botones para modifcar solo lo que necesites.
    const [modCategoria, setModCatategoria] = useState(false);
    const [modDescripcion, setModDescripcion] = useState(false);
    const habilitarModificarInput = (inputTipo) => {
        if (inputTipo === "Categoria") {
            setModCatategoria(prevState => !prevState);
            setCategoria("");
            setAnularBoton(false); // Solo muestro el boton para hacer el update si el ususario quiere modificar algo.
        } else if (inputTipo === "Descripcion") {
            setModDescripcion(prevState => !prevState);
            setDescripcion("");
            setAnularBoton(false); 
        }
    }

    return (
        <div className="container__main">
            <Sidebar 
                sidebarKey={sidebarKey}
            />
            <div className="container__general">
                <h3 className="titulo">Modificar categoría y descripción</h3>
                <div className="stock__sku">Sku: {sku}</div> 
                <div className="modificable__container">
                    <div className="data__modificable">
                        <label>
                            Categoría
                        </label>
                        {
                            (!modCategoria) &&
                            <div className="modificable">
                                <p>{categoria}</p>
                                <button className="boton__modificar" onClick={() => habilitarModificarInput("Categoria")}>Modificar</button>
                            </div>
                        }
                        {
                            (modCategoria) &&
                            <div className="container__input">
                                <input onChange={onChangeCategoria} className="input__producto" id="categoriaInput" type="text" placeholder="Categoría..."/>
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
                                <input onChange={onChangeDescripcion} className="input__producto" id="descripcionInput" type="text" placeholder="Descripción..." />
                            </div>
                        }
                    </div>
                </div>
                {
                    (!anularBoton) &&
                    <div className="">
                        <button className="boton1" id="botonAceptar" onClick={updateCategoria}> Aceptar </button>
                        <button className="boton1" id="botonCancelar" onClick={() => window.location.reload()}> Cancelar </button>
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

export default UpdateCategoria;