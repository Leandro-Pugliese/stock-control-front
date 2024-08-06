import "../App.css";
import "./insumos.css";
import "../Productos/productos.css";
import { React, useState, useEffect} from "react";
import { useNavbarContext } from "../Navbar/navbarProvider";
import Sidebar from "../Sidebar/sidebar";
import axios from "../axios";
import Mensajes from "../Componentes/mensajes";

function ListaInsumos() {

    // Contexto para navbProvider.
    const navContext = useNavbarContext()
    useEffect(() => {
        navContext.cambiarKey("INSUMO");
    }, []);

    // Contexto para la sidebar.
    const sidebarKey = "LISTA INSUMOS";
    // Indicador para filtros.
    const indicador = "INSUMOS";

    // Hooks para mostrar msj al usuario.
    const [mensaje, setMensaje] = useState("");
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [showErrorMsjPost, setShowErrorMsjPost] = useState(false);
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
            setInsumos(data);
        } catch (error) {
            let msj = error.response.data;
            setMensaje(msj);
            setShowErrorMsj(false);
            setShowErrorMsjPost(true);
            setShowMsj(false);
        }
    }

    useEffect(() => {
        insumosLista();
    },[])

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
    }
    
    return (
        <div className="container__main">
            <Sidebar 
                sidebarKey={sidebarKey}
                indicador={indicador}
                handleChangeInsumoNombre={handleChangeInsumoNombre}
                handleChangePrecioMin={handleChangePrecioMin}
                handleChangePrecioMax={handleChangePrecioMax}
                filtrar={filtrar}
                insumos={insumos}
            />
            {
                (filtrosActivos) &&
                <div className="container__general">
                    <h3 className="titulo"> Lista Insumos </h3>
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
                                    <div>${elemento.precio}</div>
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
            }
            {
                (!filtrosActivos) &&
                <div className="container__general">
                    <h3 className="titulo"> Lista Insumos </h3>
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
                                    <div>${elemento.precio}</div>
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
            }
            <Mensajes 
                mensaje={mensaje}
                showMsj={showMsj}
                showErrorMsj={showErrorMsj}
                showErrorMsjPost={showErrorMsjPost}
            />
        </div>
    );
}

export default ListaInsumos;