import "../App.css";
import "../mobile.css";
import "../general.css";
import { React, useState, useEffect} from "react";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Sidebar from "../Sidebar/sidebar";
import axios from "../axios";
import Mensajes from "../Componentes/mensajes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function ListaInsumos() {
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
    const sidebarKey = "LISTA INSUMOS";
    // Indicador para filtros.
    const indicador = "INSUMOS";

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showMsj, setShowMsj] = useState(false);

    // Values para mostrar.
    const [insumos, setInsumos] = useState([]);

    // Función para enviar petición a la api.
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
                setMensaje(`Error: No se detecto el formato de usuario.`);
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

    useEffect(() => {
        insumosLista();
    },[estadoSesion])

    const modificarInsumo = (_id) => {
        sessionStorage.setItem("insumoID", _id);
        window.location.href = "/update-insumo"
    }

    // Filtros
    const [filtrosActivos, setFiltrosActivos] = useState(false);
    const [listaInsumosFiltrados, setListaInsumosFiltrados] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroPrecioMin, setFiltroPrecioMin] = useState(1);
    const [filtroPrecioMax, setFiltroPrecioMax] = useState(1000000);
    
    const handleChangeInsumoNombre = (evento) => {
        setFiltroNombre(evento.target.value);
    }
    const handleChangePrecioMin = (evento) => {
        let numMin = Number(evento.target.value);
        setFiltroPrecioMin(numMin);
    }
    const handleChangePrecioMax = (evento) => {
        let numMax = Number(evento.target.value);
        setFiltroPrecioMax(numMax);
    }

    const filtrar = () => {
        let cumplenFiltro = []
        // eslint-disable-next-line
        insumos.filter((insumo) => {
            const { nombre, precio } = insumo;
            const cumpleNombre = nombre.includes(filtroNombre);
            const cumplePrecio = precio >= filtroPrecioMin && precio <= filtroPrecioMax;
            if (cumpleNombre && cumplePrecio) {
                cumplenFiltro.push(insumo);
            }
        })
        setListaInsumosFiltrados(cumplenFiltro);
        setFiltrosActivos(true);
        activarSidebar("-");
    }
    
    // Función para formatear número a moneda.
    const formateoMoneda = (valor) => {
        return valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
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
                indicador={indicador}
                handleChangeInsumoNombre={handleChangeInsumoNombre}
                handleChangePrecioMin={handleChangePrecioMin}
                handleChangePrecioMax={handleChangePrecioMax}
                filtrar={filtrar}
                insumos={insumos}
                estadoSidebar={estadoSidebar}
            />
            {
                (filtrosActivos) &&
                <div className="container__general general__mobile">
                    <h3 className="titulo"> Insumos Filtrados </h3>
                    <div className="scrollInsumos">
                        {
                            listaInsumosFiltrados.map((elemento, indice) => (
                                <div className="insumo__data" key={indice}> 
                                    <div className="data__container-insumo">
                                        <div className="container__dataFija-insumo">
                                            <div className="dataFija__titulo"> Insumo </div>
                                        </div>
                                        <div>{elemento.nombre}</div>
                                    </div> 
                                    <div className="data__container-insumo">
                                        <div className="container__dataFija-insumo">
                                            <div className="dataFija__titulo"> Precio </div>
                                        </div>
                                        <div>{formateoMoneda(elemento.precio)}</div>
                                    </div> 
                                    <div className="data__container-insumo">
                                        <div className="container__dataFija-insumo">
                                            <div className="dataFija__titulo"> Descripción </div>
                                        </div>
                                        <div>{elemento.descripcion}</div>
                                    </div> 
                                    <button className="boton__modInsumo" onClick={() => modificarInsumo(elemento._id)}>
                                        Modificar
                                    </button>
                                </div>
                            ))
                        }
                        {
                        (listaInsumosFiltrados.length === 0) &&
                            <div className="sinResultado">No hay insumos que cumplan con los filtros utilizados...</div>
                        }
                    </div>
                </div>
            }
            {
                (!filtrosActivos) &&
                <div className="container__general general__mobile">
                    <h3 className="titulo"> Lista Insumos </h3>
                    <div className="scrollInsumos">
                        {
                            insumos.map((elemento, indice) => (
                                <div className="insumo__data" key={indice}> 
                                    <div className="data__container-insumo">
                                        <div className="container__dataFija-insumo">
                                            <div className="dataFija__titulo"> Insumo </div>
                                        </div>
                                        <div>{elemento.nombre}</div>
                                    </div> 
                                    <div className="data__container-insumo">
                                        <div className="container__dataFija-insumo">
                                            <div className="dataFija__titulo"> Precio </div>
                                        </div>
                                        <div>{formateoMoneda(elemento.precio)}</div>
                                    </div> 
                                    <div className="data__container-insumo">
                                        <div className="container__dataFija-insumo">
                                            <div className="dataFija__titulo"> Descripción </div>
                                        </div>
                                        <div>{elemento.descripcion}</div>
                                    </div> 
                                    <button className="boton__modInsumo" onClick={() => modificarInsumo(elemento._id)}>
                                        Modificar
                                    </button>
                                </div>
                            ))
                        }
                    </div>
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
    );
}

export default ListaInsumos;