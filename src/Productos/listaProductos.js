import "../App.css";
import "./productos.css";
import { useState, useEffect } from "react";
import axios from "../axios";
import Sidebar from "../Sidebar/sidebar";
import { useNavbarContext } from "../Navbar/navbarProvider";

function ListaProductos() {

    // Contexto para navbProvider.
    const navContext = useNavbarContext()
    useEffect(() => {
        navContext.cambiarKey("PRODUCTO");
    // eslint-disable-next-line
    }, []);
    
    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showErrorMsjPost, setShowErrorMsjPost] = useState(false);
    const [showMsj, setShowMsj] = useState(false);

    // Hooks para renderizado de lista de productos o formulario de carga de producto y lista de insumos.
    const [insumos, setInsumos] = useState([]);
    const [showListaProductos, setShowListaProductos] = useState(true);
    const [showCargarProducto, setShowCargarProducto] = useState(false);
    const renderProductosLista = () => {
        setShowListaProductos(true);
        setShowCargarProducto(false);
        setShowProducto(false);
        setShowErrorMsj(false);
        setShowErrorMsjPost(false);
        setShowMsj(false);
    }
    const renderProductosCarga = async() => {
        setShowListaProductos(false);
        setShowCargarProducto(true);
        setShowProducto(false);
        setShowErrorMsj(false);
        setShowErrorMsjPost(false);
        setShowMsj(false);
        // Pedimos la lista de los insumos para cargar en el producto.
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
            //console.log(response);
            let data = response.data;
            setInsumos(data);
            //console.log(data);
        } catch (error) {
            //console.log(error)
            let msj = error.response.data;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(true);
            setShowMsj(false);
        }
    }
    
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
                setShowListaProductos(true);
                setShowCargarProducto(false);
            } else {
                setShowListaProductos(true);
                setShowCargarProducto(false);
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
            //console.log(data);
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
        listaProductos()
    },[])

    // Values de los inputs para cargar producto
    const [sku, setSku] = useState("");
    const [stock, setStock] = useState([]);
    const [componentes, setComponentes] = useState([]);
    const [categoria, setCategoria] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const onChangeSku = function (evento) {
        setSku(evento.target.value);
    };
    const onChangeCategoria = function (evento) {
        setCategoria(evento.target.value);
    };
    const onChangeDescripcion = function (evento) {
        setDescripcion(evento.target.value);
    };

    // Hooks y función para cargar stock.
    const [stockColor, setStockColor] = useState("");
    const [stockUnidades, setStockUnidades] = useState("");
    const onChangeStockColor = function (evento) {
        setStockColor(evento.target.value);
    };
    const onChangeStockUnidades = function (evento) {
        let numberUnidades = Number(evento.target.value);
        setStockUnidades(numberUnidades);
    };
    const addStock = () => {
        let stockCopia = [...stock];
        const filtroRepetido = stockCopia.filter((stock) => stock.color === stockColor.toUpperCase());
        if (filtroRepetido.length >= 1) {
            const msj = "Color ya ingresado.";
            setMensaje(msj);
            setShowErrorMsj(true);
            setShowErrorMsjPost(false);
            setShowMsj(false);
            return
        }
        if (stockColor === "" || stockColor === " " || stockColor === "-") {
            const msj = "Ingresa un color válido.";
            setMensaje(msj);
            setShowErrorMsj(true);
            setShowErrorMsjPost(false);
            setShowMsj(false);
            return
        }
        if (stockUnidades < 0 || stockUnidades === "") {
            const msj = "Ingresa una cantidad válida de unidades.";
            setMensaje(msj);
            setShowErrorMsj(true);
            setShowErrorMsjPost(false);
            setShowMsj(false);
            return
        }
        const nuevoObjStock = {
            color: stockColor.toUpperCase(),
            unidades: stockUnidades
        }
        stockCopia.push(nuevoObjStock);
        setStock(stockCopia);
        setShowErrorMsj(false);
        setShowErrorMsjPost(false);
        setShowMsj(false);
    }

    // Hooks y función para cargar componentes.
    const [componenteNombre, setComponenteNombre] = useState("-");
    const [componenteCantidad, setComponenteCantidad] = useState(0);
    const onChangeComponenteNombre = function (evento) {
        setComponenteNombre(evento.target.value);
    };
    const onChangeComponenteCantidad = function (evento) {
        // Bug en input type number, lo pasa como string. Hay que transformarlo a número.
        let numberCantidad = Number(evento.target.value);
        setComponenteCantidad(numberCantidad);
    };
    const addComponente = () => {
        let componentesCopia = [...componentes];
        const filtroRepetido = componentesCopia.filter((componente) => componente.insumo === componenteNombre);
        if (filtroRepetido.length >= 1) {
            const msj = "Componente ya ingresado.";
            setMensaje(msj);
            setShowErrorMsj(true);
            setShowErrorMsjPost(false);
            setShowMsj(false);
            return
        }
        if (componenteNombre === "-") {
            const msj = "Tienes que seleccionar un componente.";
            setMensaje(msj);
            setShowErrorMsj(true);
            setShowErrorMsjPost(false);
            setShowMsj(false);
            return
        }
        if (componenteCantidad <= 0) {
            const msj = "La cantidad del componente no puede ser menor o igual a cero.";
            setMensaje(msj);
            setShowErrorMsj(true);
            setShowErrorMsjPost(false);
            setShowMsj(false);
            return
        }
        const nuevoObjComponente = {
            insumo: componenteNombre,
            cantidad: componenteCantidad
        }
        componentesCopia.push(nuevoObjComponente);
        setComponentes(componentesCopia);
        setShowErrorMsj(false);
        setShowErrorMsjPost(false);
        setShowMsj(false);
    }

    // Eliminar stock / componentes de la lista.
    const eliminarStock = (color) => {
        let stockCopia = [...stock];
        const listaFiltrada = stockCopia.filter((elemento) => elemento.color !== color);
        setStock(listaFiltrada);
    }
    const eliminarComponente = (insumo) => {
        let componentesCopia = [...componentes];
        const listaFiltrada = componentesCopia.filter((elemento) => elemento.insumo !== insumo);
        setComponentes(listaFiltrada);
    }

    // Hooks y config para crear producto.
    const [productoCargado, setProductoCargado] = useState({});
    const [showProducto, setShowProducto] = useState(false);
    const cargarProducto = async () => {
        try {
            if (sku === "" || categoria === "" || descripcion === "" || stock.length === 0 || componentes.length === 0) {
                const msj = "Debes completar todos los campos.";
                setMensaje(msj);
                setShowErrorMsj(true);
                setShowErrorMsjPost(false);
                setShowMsj(false);
                return
            }
            if (sku.length <= 9 || sku.length >= 11) {
                const msj = "El sku debe contener 10 caracteres.";
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
                    url: "/producto/crear",
                    json: true,
                    data: {sku, stock, componentes, categoria, descripcion},
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": tokenAxios,
                    },
                };
            } else if (user === "admin") {
                config = {
                    method: "post",
                    url: "/producto/crear-admin",
                    json: true,
                    data: {sku, stock, componentes, categoria, descripcion},
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
            setMensaje(data.msj);
            setShowMsj(true);
            setProductoCargado(data.producto);
            setShowProducto(true);
            //console.log(data);
        } catch (error) {
            //console.log(error)
            let msj = error.response.data;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(true);
            setShowMsj(false);
        }
    }
    const cargarNuevoProducto = () => {
        setSku("");
        setStock([])
        setComponentes([]);
        setCategoria("");
        setDescripcion("");
        setStockColor("");
        setStockUnidades("");
        setComponenteNombre("-");
        setComponenteCantidad(0);
        setShowProducto(false);
    }

    return (
        <div className="container__main">
            <Sidebar 
                renderProductosLista={renderProductosLista}
                renderProductosCarga={renderProductosCarga}
            />
            {
                (showListaProductos) &&
                <div className="container__general">
                    <h3 className="titulo"> Lista Productos </h3>
                    {
                    productos.map((element, index) => (
                        <div className="producto__data" key={index}>
                            <p> SKU: {element.sku} </p>
                            <div className="producto__stock">
                                <p> STOCK:</p> 
                                {
                                    element.stock.map((elemento, indice) => (
                                        <div key={indice}> 
                                            <p> {elemento.color}, ({elemento.unidades}) </p>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="producto__componentes">
                                <p> COMPONENTES: </p>
                                {
                                    element.componentes.map((elemento, indice) => (
                                        <div key={indice}> 
                                            <p> {`${elemento.insumo}(${elemento.cantidad})`} </p>
                                        </div>
                                    ))
                                }
                            </div>
                            <p> CATEGORÍA: {element.categoria} </p>
                            <p> DESCRIPCIÓN: {element.descripcion}</p>
                            <div>
                                <hr/>
                            </div>
                        </div>
                    ))
                    }
                </div>
            }
            {
                (showCargarProducto) &&
                <div className="container__general">
                    <h3 className="titulo"> Cargar Producto </h3>
                    {
                        (!showProducto) &&
                        <div>
                            <div className="">
                                <input onChange={onChangeSku} className="" id="skuInput" type="text" placeholder="Sku..."/>
                            </div>
                            <div className="">
                                <input onChange={onChangeCategoria} className="" id="categoriaInput" type="text" placeholder="Categoría..."/>
                            </div>
                            <div className="">
                                <input onChange={onChangeDescripcion} className="" id="descripcionInput" type="text" placeholder="Descripción..."/>
                            </div>
                            <div className="">
                                <input onChange={onChangeStockColor} className="" id="colorStockInput" type="text" placeholder="Color..."/>
                                <input onChange={onChangeStockUnidades} className="" id="unidadesStockInput" type="number" placeholder="Unidades..."/>
                                <button onClick={addStock}>Agregar al stock</button>
                                {
                                    (stock.length >= 1) &&
                                    <div className="lista__items">
                                    {
                                        stock.map((elemento, indice) => (
                                            <div key={indice}>
                                                {`[${elemento.color}: ${elemento.unidades}]`}
                                                <button className="x__button" onClick={() => eliminarStock(elemento.color)}>
                                                    <i className="fa-solid fa-circle-xmark"></i>
                                                </button>
                                            </div>
                                        ))
                                    }
                                    </div>
                                }
                            </div>
                            <div>
                                <select onChange={onChangeComponenteNombre} defaultValue="-">
                                    <option value="-">-</option>
                                {
                                    insumos.map((element, index) => (
                                        <option key={index} value={element.nombre}>
                                            {element.nombre}
                                        </option>
                                    ))
                                }
                                </select>
                                <input onChange={onChangeComponenteCantidad} className="" id="insumoCantidadInput" type="number" placeholder="Cantidad..."/>
                                <button onClick={addComponente}>Agregar componente</button>
                                {
                                    (componentes.length >= 1) &&
                                    <div className="lista__items">
                                    {
                                        componentes.map((elemento, indice) => (
                                            <div key={indice}>
                                                {`[${elemento.insumo}: ${elemento.cantidad}]`}
                                                <button className="x__button" onClick={() => eliminarComponente(elemento.insumo)}>
                                                    <i className="fa-solid fa-circle-xmark"></i>
                                                </button>
                                            </div>
                                        ))
                                    }
                                    </div>
                                }
                            </div>
                            <div>
                                <button onClick={cargarProducto}> CARGAR </button>
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
                        (showProducto) &&
                        <div className="productoCargado">
                            <div>SKU: {productoCargado.sku}</div>
                            <div>Categoría: {productoCargado.categoria}</div>
                            <div>Descripción: {productoCargado.descripcion}</div>
                            <div className="lista__items">Stock:
                                {
                                    productoCargado.stock.map((elemento, indice) => (
                                        <div key={indice}>
                                            {`[${elemento.color}: ${elemento.unidades}]`}
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="lista__items">Componentes:
                                {
                                    productoCargado.componentes.map((elemento, indice) => (
                                        <div key={indice}>
                                            {`[${elemento.insumo}: ${elemento.cantidad}]`}
                                        </div>
                                    ))
                                }
                            </div>
                            <div>
                                <button onClick={cargarNuevoProducto}> CARGAR NUEVO PRODUCTO </button>
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    );
}

export default ListaProductos;