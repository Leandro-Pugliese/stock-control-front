import "../App.css";
import "../general.css";
import { React, useState, useEffect} from "react";
import axios from "../axios";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Sidebar from "../Sidebar/sidebar";
import Mensajes from "../Componentes/mensajes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function Rentabilidad() {
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
        navContext.cambiarKey("PRODUCTO");
        sesionIniciada();
    // eslint-disable-next-line
    }, []);

    // Contexto para la sidebar
    const sidebarKey = "RENTABILIDAD";

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showMsj, setShowMsj] = useState(false);

    // Hooks para producto.
    const [sku, setSku] = useState("");
    const [stock, setStock] = useState([]);
    const [componentes, setComponentes] = useState([]);
    const [categoria, setCategoria] = useState("");
    const [descripcion, setDescripcion] = useState("");
    
    //Obtenemos el sku del storage antes de buscar el producto para ver su stock.
    const [skuCargado, setSkuCargado] = useState(false);
    const setSkuData = () => {
        setSku(sessionStorage.getItem("sku"));
        setSkuCargado(true);
    }
    useEffect(() => {
        setSkuData();
    }, [estadoSesion]);
    useEffect(() => {
        productoData();
        insumosLista();
    // eslint-disable-next-line
    }, [skuCargado]);

    // Data del producto para ver descripción y categoría.
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
                setMensaje(`No tienes permiso para utilizar esta ruta.`);
                setShowErrorMsj(true);
                setShowMsj(false);
                return
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
            setStock(data.stock);
            setComponentes(data.componentes);
            setCategoria(data.categoria);
            setDescripcion(data.descripcion);
        } catch (error) {
            setMensaje(error.response.data);
            setShowErrorMsj(true);
            setShowMsj(false);
        }
    } 

    // Data de los insumos para calcular costos.
    const [insumos, setInsumos] = useState([]);
    const insumosLista = async () => {
        try {
            // Verifico el tipo de usuario y cargo su token.
            const user = sessionStorage.getItem("user");
            const tokenAxios = sessionStorage.getItem("token");
            let config = {};
            // Armamos la config de axios para enviar la petición (varía si es un usuario o un administrador).
            if (user === "admin") {
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
                setMensaje(`Error: No se detecto usuario administrador.`);
                setShowErrorMsj(true);
                setShowMsj(false);
                return
            }
            // llamado axios con la config lista.
            const response = await axios(config);
            let data = response.data;
            setInsumos(data);
        } catch (error) {
            setMensaje(error.response.data);
            setShowErrorMsj(true);
            setShowMsj(false);
        }
    }
    
    // Calculadora de costos.
    const [costosFinal, setCostosFinal] = useState([]);
    const [costoTotal, setCostoTotal] = useState([]);
    const costos = () => {
        let costosSeparados = [];
        // Armo un nuevo array de obj con el nombre del componente y el costo total del componente.
        componentes.map(componente => {
            let insumo = insumos.find(insumo => insumo.nombre === componente.insumo);
            let costo = componente.cantidad * insumo.precio;
            let objFinal =  {
              componente: componente.insumo,
              costo: costo
            };
            return costosSeparados.push(objFinal);
        });
        setCostosFinal(costosSeparados);
        // Calculo el costo total del producto.
        setCostoTotal(costosSeparados.reduce((total, componente) => total + componente.costo, 0));
    }
    useEffect(() => {
        costos();
        // eslint-disable-next-line
    }, [componentes]);

    // Función para formatear número a moneda.
    const formateoMoneda = (valor) => {
        return valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    }

    // Calculadora de rentabilidad.
    const [calcularRent, setCalcularRent] = useState(0);
    const rentabilidadPrecioFinal = (costoTotal, porcentajeRentabilidad) => {
        // El porcentaje de rentabilidad se divide por 100 para convertirlo en un decimal.
        let rentabilidad = costoTotal * (porcentajeRentabilidad / 100);
        let precioFinal = costoTotal + rentabilidad;
        return precioFinal;   
    }
    const rentabilidadGanancia = (costoTotal, porcentajeRentabilidad) => {
        return costoTotal * (porcentajeRentabilidad / 100); 
    }
    const onChangeCalcularRent = function (evento) {
        let num = Number(evento.target.value);
        setCalcularRent(num);
    };

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
                <h3 className="titulo"> Rentabilidad </h3>
                <div className="">
                    <div className="stock__sku"> Sku: {sku} </div> 
                    <div className="stock__lista noMargin"> Stock: 
                        {
                            stock.map((elemento, indice) => (
                                <div className="" key={indice}>
                                    {`[${elemento.color}: ${elemento.unidades}]`}
                                </div>
                            ))
                        } 
                    </div> 
                    <div className="stock__sku"> Categoría: {categoria} </div> 
                    <div className="stock__sku"> Descripción: {descripcion} </div>
                </div>
                <div className="container__secundario scroll__rentabilidad">
                    <div className="caluladora__container">
                        <p> Costos Producto </p>
                        <div className="componentes__lista"> 
                        {
                            costosFinal.map((elemento, indice) => (
                                <div className="componente__container" key={indice}>
                                    <div> {`${elemento.componente}:`} </div>
                                    <div> {`${formateoMoneda(elemento.costo)}`} </div>
                                </div>
                            ))
                        } 
                        <div className="costo__total">
                                <div> Costo Total: </div> 
                                <div> {formateoMoneda(costoTotal)} </div>
                            </div>
                    </div> 
                    </div>
                    <div className="caluladora__container">
                        <p> Rentabilidad Producto </p>
                        {/* El inicial por default lo dejo calculado en 100% */}
                        <div className="calculadora__fija">
                            <div className="rent">Rent. 100%</div>
                            <div className="detalles">
                                <div>Precio Final:</div>
                                <div>{formateoMoneda(rentabilidadPrecioFinal(costoTotal, 100))}</div>
                            </div>
                            <div className="detalles">
                                <div>Ganancia:</div>
                                <div>{formateoMoneda(rentabilidadGanancia(costoTotal, 100))}</div>
                            </div>
                        </div>
                        <div className="calculadora__funciones">
                            <label className="">Rent. Deseada: </label>
                            <input className="input__producto" onChange={onChangeCalcularRent} id="rentInput" type="number" placeholder="0%..." />
                        </div>
                        <div className="calculadora__fija">
                            <div className="rent">Rent. {calcularRent}%</div>
                            <div className="detalles">
                                <div>Precio Final:</div>
                                <div>{formateoMoneda(rentabilidadPrecioFinal(costoTotal, calcularRent))}</div>
                            </div>
                            <div className="detalles">
                                <div>Ganancia:</div>
                                <div>{formateoMoneda(rentabilidadGanancia(costoTotal, calcularRent))}</div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                {
                    (mensaje) &&
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

export default Rentabilidad;