import "../App.css";
import "./productos.css";
import { React, useState, useEffect} from "react";
import axios from "../axios";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Sidebar from "../Sidebar/sidebar";
import Mensajes from "../Componentes/mensajes";

function Rentabilidad() {

    // Contexto para navbProvider.
    const navContext = useNavbarContext()
    useEffect(() => {
        navContext.cambiarKey("PRODUCTO");
    // eslint-disable-next-line
    }, []);

    // Contexto para la sidebar
    const sidebarKey = "RENTABILIDAD";

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showErrorMsjPost, setShowErrorMsjPost] = useState(false);
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
    }, []);
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
                const msj = `No tienes permiso para utilizar esta ruta.`;
                setMensaje(msj);
                setShowErrorMsj(true);
                setShowErrorMsjPost(false);
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
                const msj = `Error: No se detecto el formato de usuario.`;
                setMensaje(msj);
                setShowErrorMsj(true);
                setShowErrorMsjPost(false);
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
            let msj = error.response.data;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(true);
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
                const msj = `Error: No se detecto usuario administrador.`;
                setMensaje(msj);
                setShowErrorMsj(true);
                setShowErrorMsjPost(false);
                setShowMsj(false);
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
            costosSeparados.push(objFinal);
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
    const [calcularRent, setCalcularRent] = useState(100);
    const rentabilidadPrecioFinal = (costoTotal, porcentajeRentabilidad) => {
        // El porcentaje de rentabilidad se divide por 100 para convertirlo en un decimal.
        let rentabilidad = costoTotal * (porcentajeRentabilidad / 100);
        let precioFinal = costoTotal + rentabilidad;
        return precioFinal;   
    }
    const rentabilidadGanancia = (costoTotal, porcentajeRentabilidad) => {
        return costoTotal * (porcentajeRentabilidad / 100); 
    }
    
    // Hooks para calculadora de rentabilidad.
    const [showRent, setShowRent] = useState(false);
    const calcular = () => {
        if (showRent === true) {
            setCalcularRent(100);
        }
        setShowRent(prevShowRent => !prevShowRent);
    }
    const onChangeCalcularRent = function (evento) {
        let num = Number(evento.target.value);
        setCalcularRent(num);
    };

    return (
        <div className="container__main">
            <Sidebar 
                sidebarKey={sidebarKey}
            />
            <div className="container__general">
                <h3> Rentabilidad </h3>
                <div className="">
                    <div className=""> Sku: {sku} </div> 
                    <div className="producto__stock"> Stock: 
                        {
                            stock.map((elemento, indice) => (
                                <div className="stock__container" key={indice}>
                                    {`[${elemento.color}: ${elemento.unidades}]`}
                                </div>
                            ))
                        } 
                    </div> 
                    <div className="producto__componentes"> Componentes: 
                        {
                            componentes.map((elemento, indice) => (
                                <div className="componente__container" key={indice}>
                                    {`[${elemento.insumo}: ${elemento.cantidad}]`}
                                </div>
                            ))
                        } 
                    </div> 
                    <div className=""> Categoría: {categoria} </div> 
                    <div className=""> Descripción: {descripcion} </div>
                </div>
                <div className="titulo__container"> 
                    <h4> Calculadora </h4>
                </div>
                <div className="container__secundario">
                    <div className="caluladora__container">
                        <p> Costos </p>
                        <div className=""> Componentes: 
                        {
                            costosFinal.map((elemento, indice) => (
                                <div className="componente__container" key={indice}>
                                    {`[${elemento.componente}: ${formateoMoneda(elemento.costo)}]`}
                                </div>
                            ))
                        } 
                        <div>Costo Total: {formateoMoneda(costoTotal)}</div>
                    </div> 
                    </div>
                    <div className="caluladora__container">
                        <p> Rentabilidad </p>
                        {/* El inicial por default lo dejo calculado en 100% */}
                        <div className="calculadora__fija">
                            <div className="">Rent. 100%</div>
                            <div className="">
                                {`[Precio Final: ${formateoMoneda(rentabilidadPrecioFinal(costoTotal, 100))}]`}
                                {` / [Ganancia: ${formateoMoneda(rentabilidadGanancia(costoTotal, 100))}]`}
                            </div>
                        </div>
                        {
                            (!showRent) &&
                            <div className="calculadora__funciones">
                                <label>Rentabilidad Deseada...</label>
                                <input onChange={onChangeCalcularRent} id="rentInput" type="number" placeholder="100%..."/>
                                <button onClick={calcular}> Calcular </button>
                                <Mensajes 
                                    mensaje={mensaje}
                                    showMsj={showMsj}
                                    showErrorMsj={showErrorMsj}
                                    showErrorMsjPost={showErrorMsjPost}
                                />
                            </div>
                        }
                        {
                            (showRent) &&
                            <div className="calculadora__fija">
                                <div className="">Rent. {calcularRent}%</div>
                                <div className="">
                                    {`[Precio Final: ${formateoMoneda(rentabilidadPrecioFinal(costoTotal, calcularRent))}]`}
                                    {` / [Ganancia: ${formateoMoneda(rentabilidadGanancia(costoTotal, calcularRent))}]`}
                                </div>
                                <button onClick={calcular}> Volver </button>
                            </div>
                        }
                    </div>
                </div>
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

export default Rentabilidad;