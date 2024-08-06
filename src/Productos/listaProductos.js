import "../App.css";
import "./productos.css";
import { useState, useEffect } from "react";
import axios from "../axios";
import Sidebar from "../Sidebar/sidebar";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Mensajes from "../Componentes/mensajes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

function ListaProductos() {

    // Contexto para navbProvider.
    const navContext = useNavbarContext()
    useEffect(() => {
        navContext.cambiarKey("PRODUCTO");
    // eslint-disable-next-line
    }, []);

    // Contexto para la sidebar
    const sidebarKey = "LISTA PRODUCTOS";
    // Indicador para filtros.
    const [indicador, setIndicador] = useState("PRODUCTOS");
    
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
        //Recargamos la pagina para limpiar tambien los filtros y cargar nueva lista de forma más fácil.
        window.location.reload()
    }
    const renderProductosCarga = () => {
        setShowListaProductos(false);
        setShowCargarProducto(true);
        setShowProducto(false);
        setShowErrorMsj(false);
        setShowErrorMsjPost(false);
        setShowMsj(false);
        setIndicador("CARGA");
    }
    const insumosLista = async () => {
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

    // Veo si el usuario es admin para renderizar el boton de rentabilidad.
    const [user, setUser] = useState([]);

    useEffect(() => {
        setUser(sessionStorage.getItem("user"));
        listaProductos();
        insumosLista();
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
        setShowErrorMsj(false);
        setShowErrorMsjPost(false);
        setShowMsj(false);
    }

    //Funciones para modificar el producto.
    const modificarStock = async(sku) => {
        sessionStorage.setItem("skuModificar", sku);
        window.location.href = "/productos/update-stock"
    }
    const modificarComponentes = async(sku) => {
        sessionStorage.setItem("skuModificar", sku);
        window.location.href = "/productos/update-componentes"
    }
    const modificarCategoria = async(sku) => {
        sessionStorage.setItem("skuModificar", sku);
        window.location.href = "/productos/update-categoria"
    }
    const verRentabilidad = async(sku) => {
        sessionStorage.setItem("sku", sku);
        window.location.href = "/rentabilidad"
    }


    // Filtros ----------------------------------------------------------------
    const [filtrosActivos, setFiltrosActivos] = useState(false);
    const [listaProductosFiltrados, setListaProductosFiltrados] = useState([]);
    const [filtroSku, setFiltroSku] = useState("");
    const [filtroStockMin, setFiltroStockMin] = useState(1);
    const [filtroStockMax, setFiltroStockMax] = useState(1000);
    const [filtroInsumo, setFiltroInsumo] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const handleChangeSku = (evento) => {
        setFiltroSku(evento.target.value);
    }
    const handleChangeStockMin = (evento) => {
        let numMin = Number(evento.target.value);
        setFiltroStockMin(numMin);
    }
    const handleChangeStockMax = (evento) => {
        let numMax = Number(evento.target.value);
        setFiltroStockMax(numMax);
    }
    const handleChangeInsumo = (evento) => {
        setFiltroInsumo(evento.target.value);
    }
    const handleChangeCategoria = (evento) => {
        setFiltroCategoria(evento.target.value);
    }
    //Función para poder usar el filtro de las categorias del producto ya predeterminadas.
    const [categoriasProductos, setCategoriasProductos] = useState([]);
    const depurarCategorias = () => {
        // Separo todas las categorias en una lista, va a repetir muchas.
        let categoriasTotales = [];
        productos.map((elemento) => (
            categoriasTotales.push(elemento.categoria)
        ))
        //Veo cuantas veces se repiten y solo me quedo el nombre una vez para usarlo en el select del filtro.
        let categoriasRepetidas = [];
        let repetidos = categoriasTotales.reduce((counter, value) => { if (!counter[value]) counter[value] = 1; else counter[value]++; return counter }, []);
        Object.entries(repetidos).forEach(counter => categoriasRepetidas.push({ categoria: counter[0], vecesRepetida: counter[1] }));
        setCategoriasProductos(categoriasRepetidas);
    }
    useEffect(() => {
        depurarCategorias()
    },[productos])

    const filtrar = () => {
        let cumplenFiltro = []
        productos.filter((producto) => {
            const { sku, stock, componentes, categoria } = producto;
            const cumpleSku = sku.includes(filtroSku);
            const stockTotal = stock.reduce((acc, item) => acc + item.unidades, 0);
            const cumpleStock = stockTotal >= filtroStockMin && stockTotal <= filtroStockMax;
            const cumpleInsumo = filtroInsumo === "" || componentes.some((comp) => comp.insumo.includes(filtroInsumo));
            const cumpleCategoria = categoria.includes(filtroCategoria);
            if (cumpleSku && cumpleCategoria && cumpleInsumo && cumpleStock) {
                cumplenFiltro.push(producto)
            }
        })
        setListaProductosFiltrados(cumplenFiltro);
        setFiltrosActivos(true);
    }

    return (
        <div className="container__main">
            <Sidebar 
                renderProductosLista={renderProductosLista}
                renderProductosCarga={renderProductosCarga}
                sidebarKey={sidebarKey}
                indicador={indicador}
                handleChangeSku={handleChangeSku}
                handleChangeStockMin={handleChangeStockMin}
                handleChangeStockMax={handleChangeStockMax}
                handleChangeInsumo={handleChangeInsumo}
                handleChangeCategoria={handleChangeCategoria}
                filtrar={filtrar}
                productos={productos}
                insumos={insumos}
                categoriasProductos={categoriasProductos}
            />
            {
                (showListaProductos && filtrosActivos) &&
                <div className="container__general">
                    <h3 className="titulo">Productos Filtrados</h3>
                    {
                        listaProductosFiltrados.map((element, index) => (
                        <div className="producto__data" key={index}>
                            <div className="data__container">
                                <div className="container__dataFija">
                                    <div className="dataFija__titulo"> SKU </div>
                                    {
                                        (user === "admin") &&
                                        <div className="dataFija__boton">
                                            <button className="boton__modificar" onClick={() => verRentabilidad(element.sku)}>Rentabilidad</button>
                                        </div>
                                    }
                                </div>
                                <div className="dataVariable"> {element.sku} </div>
                            </div>
                            <div className="data__container">
                                <div className="container__dataFija">
                                    <div className="dataFija__titulo"> STOCK  </div>
                                    <div className="dataFija__boton">
                                        <button className="boton__modificar" onClick={() => modificarStock(element.sku)}>Modificar</button>
                                    </div>
                                </div> 
                                <div className="producto__stock">
                                    {
                                        element.stock.map((elemento, indice) => (
                                            <div className="stock__container" key={indice}> 
                                                {`[${elemento.color}: ${elemento.unidades}]`}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="data__container">
                                <div className="container__dataFija">
                                    <div className="dataFija__titulo"> COMPONENTES </div>
                                    <div className="dataFija__boton">
                                        <button className="boton__modificar" onClick={() => modificarComponentes(element.sku)}>Modificar</button> 
                                    </div>
                                </div>
                                <div className="producto__componentes">
                                    {
                                        element.componentes.map((elemento, indice) => (
                                            <div className="" key={indice}> 
                                                {`[${elemento.insumo}: ${elemento.cantidad}]`}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="data__container">
                                <div className="container__dataFija">
                                    <div className="dataFija__titulo"> CATEGORÍA </div>
                                    <div className="dataFija__boton">
                                        <button className="boton__modificar" onClick={() => modificarCategoria(element.sku)}>Modificar</button> 
                                    </div>
                                </div> 
                                <div className="dataVariable"> {element.categoria} </div>
                            </div>
                            <div className="data__container">
                                <div className="container__dataFija">
                                    <div className="dataFija__titulo"> DESCRIPCIÓN </div>
                                    <div className="dataFija__boton">
                                        <button className="boton__modificar" onClick={() => modificarCategoria(element.sku)}>Modificar</button> 
                                    </div>
                                </div>
                                <div className="dataVariable">{element.descripcion} </div>
                            </div>
                        </div>
                        ))
                    }
                </div>
            }
            {
                (showListaProductos && !filtrosActivos) &&
                <div className="container__general">
                    <h3 className="titulo"> Lista Productos </h3>
                    {
                    productos.map((element, index) => (
                        <div className="producto__data" key={index}>
                            <div className="data__container">
                                <div className="container__dataFija">
                                    <div className="dataFija__titulo"> SKU </div>
                                    {
                                        (user === "admin") &&
                                        <div className="dataFija__boton">
                                            <button className="boton__modificar" onClick={() => verRentabilidad(element.sku)}>Rentabilidad</button>
                                        </div>
                                    }
                                </div>
                                <div className="dataVariable"> {element.sku} </div>
                            </div>
                            <div className="data__container">
                                <div className="container__dataFija">
                                    <div className="dataFija__titulo"> STOCK  </div>
                                    <div className="dataFija__boton">
                                        <button className="boton__modificar" onClick={() => modificarStock(element.sku)}>Modificar</button>
                                    </div>
                                </div> 
                                <div className="producto__stock">
                                    {
                                        element.stock.map((elemento, indice) => (
                                            <div className="stock__container" key={indice}> 
                                                {`[${elemento.color}: ${elemento.unidades}]`}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="data__container">
                                <div className="container__dataFija">
                                    <div className="dataFija__titulo"> COMPONENTES </div>
                                    <div className="dataFija__boton">
                                        <button className="boton__modificar" onClick={() => modificarComponentes(element.sku)}>Modificar</button> 
                                    </div>
                                </div>
                                <div className="producto__componentes">
                                    {
                                        element.componentes.map((elemento, indice) => (
                                            <div className="" key={indice}> 
                                                {`[${elemento.insumo}: ${elemento.cantidad}]`}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="data__container">
                                <div className="container__dataFija">
                                    <div className="dataFija__titulo"> CATEGORÍA </div>
                                    <div className="dataFija__boton">
                                        <button className="boton__modificar" onClick={() => modificarCategoria(element.sku)}>Modificar</button> 
                                    </div>
                                </div> 
                                <div className="dataVariable"> {element.categoria} </div>
                            </div>
                            <div className="data__container">
                                <div className="container__dataFija">
                                    <div className="dataFija__titulo"> DESCRIPCIÓN </div>
                                    <div className="dataFija__boton">
                                        <button className="boton__modificar" onClick={() => modificarCategoria(element.sku)}>Modificar</button> 
                                    </div>
                                </div>
                                <div className="dataVariable">{element.descripcion}</div>
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
                            <div className="container__input">
                                <input onChange={onChangeSku} className="input__producto" id="skuInput" type="text" placeholder="Sku..."/>
                            </div>
                            <div className="container__input">
                                <input onChange={onChangeCategoria} className="input__producto" id="categoriaInput" type="text" placeholder="Categoría..."/>
                            </div>
                            <div className="container__input">
                                <input onChange={onChangeDescripcion} className="input__producto" id="descripcionInput" type="text" placeholder="Descripción..."/>
                            </div>
                            <div className="container__input">
                                <input onChange={onChangeStockColor} className="input__producto doble__input" id="colorStockInput" type="text" placeholder="Color..."/>
                                <input onChange={onChangeStockUnidades} className="input__producto doble__input" id="unidadesStockInput" type="number" placeholder="Unidades..."/>
                                <button className="add__button" onClick={addStock}>
                                    Agregar al stock
                                </button>
                            </div>
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
                            <div className="container__input">
                                <select className="input__producto doble__input" onChange={onChangeComponenteNombre} defaultValue="-">
                                    <option value="-">Componente...</option>
                                {
                                    insumos.map((element, index) => (
                                        <option key={index} value={element.nombre}>
                                            {element.nombre}
                                        </option>
                                    ))
                                }
                                </select>
                                <input onChange={onChangeComponenteCantidad} className="input__producto doble__input" id="insumoCantidadInput" type="number" placeholder="Cantidad..."/>
                                <button className="add__button" onClick={addComponente}>
                                    Agregar componente
                                </button>
                            </div>
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
                            <div className="container__button">
                                <button onClick={cargarProducto}> CARGAR </button>
                            </div>
                        </div>
                    }
                    <Mensajes 
                        mensaje={mensaje}
                        showMsj={showMsj}
                        showErrorMsj={showErrorMsj}
                        showErrorMsjPost={showErrorMsjPost}
                    />
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