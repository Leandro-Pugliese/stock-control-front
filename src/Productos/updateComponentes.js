import "../App.css";
import "../general.css";
import { React, useState, useEffect} from "react";
import axios from "../axios";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Sidebar from "../Sidebar/sidebar";
import Mensajes from "../Componentes/mensajes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function UpdateComponentes() {
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
    }, [estadoSesion]);
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
                setMensaje(`Error: No se detecto el formato de usuario.`);
                setShowErrorMsj(true);
                setShowMsj(false);
                return
            }
            // llamado axios con la config lista.
            const response = await axios(config);
            let data = response.data;
            setInsumosLista(data);
        } catch (error) {
            setMensaje(error.response.data);
            setShowErrorMsj(true);
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
                setMensaje(`Error: No se detecto el formato de usuario.`);
                setShowErrorMsj(true);
                setShowMsj(false);
                return
            }
            // llamado axios con la config lista.
            const response = await axios(config);
            let data = response.data;
            setComponentes(data.componentes);
        } catch (error) {
            setMensaje(error.response.data);
            setShowErrorMsj(true);
            setShowMsj(false);
        }
    } 
    
    // Update del producto.
    const [anularBoton, setAnularBoton] = useState(false);
    const updateComponentes = async () => {
        try {
            if (operacion === "-" || insumo === "") {
                setMensaje("Debes completar todos los campos.");
                setShowErrorMsj(true);
                setShowMsj(false);
                return
            }
            if (cantidad <= 0) {
                setMensaje("La cantidad no puede ser menor o igual a 0.");
                setShowErrorMsj(true);
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
                setMensaje(`Error: No se detecto el formato de usuario.`);
                setShowErrorMsj(true);
                setShowMsj(false);
                return
            }
            // llamado axios con la config lista.
            const response = await axios(config);
            let data = response.data;
            setMensaje(data);
            setShowErrorMsj(false);
            setShowMsj(true);
            setAnularBoton(true);
            setTimeout(function () {
                window.location.href = "/productos/update-componentes"
              }, 1000);
        } catch (error) {
            setMensaje(error.response.data);
            setShowErrorMsj(true);
            setShowMsj(false);
        }
    } 

    //Hook para visualizar sidebar en mobile.
    const [estadoSidebar, setEstadoSidebar] = useState("sidebar sidebar__off");
    const [sidebarActiva, setsidebarActiva] = useState(false);
    const activarSidebar = (indicador) => {
        if (indicador === "ACTIVAR") {
            setEstadoSidebar("sidebar");
            setsidebarActiva(true);
        } else {
            setEstadoSidebar("sidebar sidebar__off");
            setsidebarActiva(false);
        }
    }

    return (
        <div className="container__main">
            {
                (!sidebarActiva) &&
                <button className="boton__activarSidebar" onClick={() => activarSidebar("ACTIVAR")}>
                    <FontAwesomeIcon className="activarSidebar__icono" icon={faBars} />
                </button>
            }
            {
                (sidebarActiva) &&
                <div className="layout__sidebarActiva" onClick={() => activarSidebar("-")}></div>
            }
            <Sidebar 
                sidebarKey={sidebarKey}
                estadoSidebar={estadoSidebar}
            />
            <div className="container__general general__mobile">
                <h3 className="titulo">Modificar Componentes</h3>
                <div className="stock__sku">Sku: {sku}</div> 
                <div className="stock__lista">
                    <div>Componentes: </div>
                    {componentes.map((elemento, indice) => (
                        <div className="stock__object" key={indice}>
                            {`[${elemento.insumo}: ${elemento.cantidad}]`}
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
                    <select className="input__producto" onChange={onChangeInsumo} defaultValue="-">
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
                <div className="container__input">
                    <input onChange={onChangeCantidad} className="input__producto" id="cantidadInput" type="number" placeholder="Cantidad..."/>
                </div>
                {
                    (!anularBoton) &&
                    <div className="container__button">
                        <button onClick={updateComponentes} id="boton__modificarComponentes"> Aceptar </button>
                    </div>
                }
                {
                    (showMsj || showErrorMsj) &&
                    <Mensajes 
                        mensaje={mensaje}
                        showMsj={showMsj}
                        showErrorMsj={showErrorMsj}
                    />
                }
            </div>
        </div>
    );
}

export default UpdateComponentes;