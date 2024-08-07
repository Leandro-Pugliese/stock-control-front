import "../App.css";
import "./productos.css";
import { React, useState, useEffect} from "react";
import axios from "../axios";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Sidebar from "../Sidebar/sidebar";
import Mensajes from "../Componentes/mensajes";

function UpdateStock() {
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
    const [stock, setStock] = useState([]);
    const [operacion, setOperacion] = useState("-");
    const [color, setColor] = useState("");
    const [cantidad, setCantidad] = useState(0);
    
    //Obtenemos el sku del storage antes de buscar el producto para ver su stock.
    const [skuCargado, setSkuCargado] = useState(false);
    const setSkuData = () => {
        setSku(sessionStorage.getItem("skuModificar"));
        setSkuCargado(true)
    }
    useEffect(() => {
        setSkuData();
    }, [estadoSesion]);
    useEffect(() => {
        productoData()
    // eslint-disable-next-line
    }, [skuCargado]);

    const onChangeOperacion = function (evento) {
        setOperacion(evento.target.value);
    };
    const onChangeColor = function (evento) {
        let colorEnMayusculas = evento.target.value.toUpperCase()
        setColor(colorEnMayusculas);
    };
    const onChangeCantidad = function (evento) {
        let num = Number(evento.target.value);
        setCantidad(num);
    };

    //Data del producto para ver stock.
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
            setStock(data.stock)
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
    const updateStock = async () => {
        try {
            if (operacion === "-" || color === "") {
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
                    url: "/producto/update-stock",
                    json: true,
                    data: {sku, operacion, color, cantidad},
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": tokenAxios,
                    },
                };
            } else if (user === "admin") {
                config = {
                    method: "put",
                    url: "/producto/update-stock-admin",
                    json: true,
                    data: {sku, operacion, color, cantidad},
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
                window.location.href = "/productos/update-stock"
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
                <h3 className="titulo">Modificar stock</h3>
                <div className="stock__sku">Sku: {sku}</div> 
                <div className="stock__lista">
                    <div>Stock: </div>
                    {stock.map((elemento, indice) => (
                        <div className="stock__object" key={indice}>
                            {`[${elemento.color}: ${elemento.unidades}]`}
                        </div>
                    ))}
                </div>
                <div className="container__input">
                    <select className="input__producto" onChange={onChangeOperacion} defaultValue="-">
                        <option value="-">Operación...</option>
                        <option value="ADD">Agregar</option>
                        <option value="REMOVE">Quitar</option>
                    </select>
                </div>
                <div className="container__input">
                    <input onChange={onChangeColor} className="input__producto" id="colorInput" type="text" placeholder="Color..."/>
                </div>
                <div className="container__input">
                    <input onChange={onChangeCantidad} className="input__producto" id="cantidadInput" type="number" placeholder="Cantidad..."/>
                </div>
                {
                    (!anularBoton) &&
                    <div className="container__button">
                        <button onClick={updateStock}> Aceptar </button>
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

export default UpdateStock;