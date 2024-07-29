import "../App.css";
import "./productos.css";
import { React, useState, useEffect} from "react";
import axios from "../axios";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Sidebar from "../Sidebar/sidebar";
import Mensajes from "../Componentes/mensajes";

function UpdateComponentes() {

    // Contexto para navbProvider.
    const navContext = useNavbarContext()
    useEffect(() => {
        navContext.cambiarKey("PRODUCTO");
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
    const [componentes, setComponentes] = useState([]);
    const [operacion, setOperacion] = useState("-");
    const [insumo, setInsumo] = useState("");
    const [cantidad, setCantidad] = useState(0);
    
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
        insumos();
        // eslint-disable-next-line
    }, [skuCargado]);

    // Traemos la lista de insumos para usarla en el select.
    const [insumosLista, setInsumosLista] = useState([]);
    const insumos = async() => {
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
            setInsumosLista(data);
        } catch (error) {
            let msj = error.response.data;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(true);
            setShowMsj(false);
        }
    }

    const onChangeOperacion = function (evento) {
        setOperacion(evento.target.value);
    };
    const onChangeInsumo = function (evento) {
        let insumoEnMayusculas = evento.target.value.toUpperCase()
        setInsumo(insumoEnMayusculas);
    };
    const onChangeCantidad = function (evento) {
        let num = Number(evento.target.value);
        setCantidad(num);
    };

    //Data del producto para ver los componentes.
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
            setComponentes(data.componentes);
        } catch (error) {
            let msj = error.response.data;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(true);
            setShowMsj(false);
        }
    } 
    
    // Update del producto.
    const [anularBoton, setAnularBoton] = useState(false);
    const updateComponentes = async () => {
        try {
            if (operacion === "-" || insumo === "") {
                const msj = "Debes completar todos los campos.";
                setMensaje(msj);
                setShowErrorMsj(true);
                setShowErrorMsjPost(false);
                setShowMsj(false);
                return
            }
            if (cantidad <= 0) {
                const msj = "La cantidad no puede ser menor o igual a 0.";
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
                    url: "/producto/update-componentes",
                    json: true,
                    data: {sku, operacion, insumo, cantidad},
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": tokenAxios,
                    },
                };
            } else if (user === "admin") {
                config = {
                    method: "put",
                    url: "/producto/update-componentes-admin",
                    json: true,
                    data: {sku, operacion, insumo, cantidad},
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

    return (
        <div className="container__main">
            <Sidebar 
                sidebarKey={sidebarKey}
            />
            <div className="container__general">
                <h3>Modificar Componentes Producto</h3>
                <div>Sku: {sku}</div> 
                <div className="stock__lista">
                    <div>Componentes: </div>
                    {componentes.map((elemento, indice) => (
                        <div className="stock__object" key={indice}>
                            {`[${elemento.insumo}: ${elemento.cantidad}]`}
                        </div>
                    ))}
                </div>
                <div className="">
                    <select onChange={onChangeOperacion} defaultValue="-">
                        <option value="-">Operación...</option>
                        <option value="ADD">Agregar</option>
                        <option value="REMOVE">Quitar</option>
                    </select>
                </div>
                <div className="">
                    <select onChange={onChangeInsumo} defaultValue="-">
                        <option value="-">Componente...</option>
                        {
                            insumosLista.map((elemento, indice) => (
                                <option key={indice} value={elemento.nombre}>
                                    {elemento.nombre}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className="">
                    <input onChange={onChangeCantidad} className="" id="cantidadInput" type="number" placeholder="Cantidad..."/>
                </div>
                {
                    (!anularBoton) &&
                    <div className="">
                        <button onClick={updateComponentes}> Aceptar </button>
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

export default UpdateComponentes;