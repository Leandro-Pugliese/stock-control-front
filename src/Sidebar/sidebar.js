import "../App.css";
import "./sidebar.css";
import Filtros from "../Componentes/filtros";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faPlus, faTrashCan, faCheck, faGear } from '@fortawesome/free-solid-svg-icons';

function Sidebar({  renderProductosLista, renderProductosCarga, sidebarKey, sidebarSubKey, 
                    indicador, filtrar, productos, insumos, 
                    handleChangeSku, handleChangeStockMin, handleChangeStockMax,
                    handleChangeInsumo, handleChangeCategoria, categoriasProductos,
                    handleChangeInsumoNombre, handleChangePrecioMin, handleChangePrecioMax
                }){

    return (
        <aside className="sidebar">
            {
                (sidebarKey === "LISTA PRODUCTOS") &&
                <div className="container__botones">
                    <h4> Productos </h4>
                    {
                        // El sidebarSubKey solo es para mostrar como marcado cuando se mantiene la misma sidebar en diferentes render o rutas.
                        // Solo cambiamos la clase activa.
                        (sidebarSubKey === "CARGAR-PRODUCTO") &&
                        <button className="sidebar__button" onClick={renderProductosLista}>
                            <FontAwesomeIcon className="sidebar__icon" icon={faList} /> 
                            <div>Lista</div>
                        </button>
                    }
                    {
                        
                        (sidebarSubKey === "LISTA-PRODUCTOS") &&
                        <button className="sidebar__button activo" onClick={renderProductosLista}>
                            <FontAwesomeIcon className="sidebar__icon" icon={faList} /> 
                            <div>Lista</div>
                        </button>
                    }
                    {
                        (sidebarSubKey === "LISTA-PRODUCTOS") &&
                        <button className="sidebar__button" onClick={renderProductosCarga}> 
                            <FontAwesomeIcon className="sidebar__icon" icon={faPlus} /> 
                            <div>Cargar</div>
                        </button>
                    }
                    {
                        (sidebarSubKey === "CARGAR-PRODUCTO") &&
                        <button className="sidebar__button activo" onClick={renderProductosCarga}> 
                            <FontAwesomeIcon className="sidebar__icon" icon={faPlus} /> 
                            <div>Cargar</div>
                        </button>
                    }
                    
                    <Filtros 
                        indicador={indicador}
                        productos={productos}
                        categoriasProductos={categoriasProductos}
                        handleChangeSku={handleChangeSku}
                        handleChangeStockMin={handleChangeStockMin}
                        handleChangeStockMax={handleChangeStockMax}
                        handleChangeInsumo={handleChangeInsumo}
                        handleChangeCategoria={handleChangeCategoria}
                        insumos={insumos}
                        filtrar={filtrar}
                    />
                </div>
            }
            {
                (sidebarKey === "UPDATE PRODUCTO") &&
                <div className="container__botones">
                    <h4> Productos </h4>
                    <a href="/productos" className="sidebar__a"> 
                        <FontAwesomeIcon className="sidebar__icon" icon={faList} /> 
                        <div>Lista</div> 
                    </a>
                </div>
            }
            {
                (sidebarKey === "LISTA INSUMOS") &&
                <div className="container__botones">
                    <h4> Insumos </h4>
                    <a href="/crear-insumo" className="sidebar__a"> 
                        <FontAwesomeIcon className="sidebar__icon" icon={faPlus} /> 
                        <div>Cargar</div>
                    </a>
                    <Filtros 
                        indicador={indicador}
                        handleChangeInsumo={handleChangeInsumo}
                        handleChangeInsumoNombre={handleChangeInsumoNombre} 
                        handleChangePrecioMin={handleChangePrecioMin} 
                        handleChangePrecioMax={handleChangePrecioMax}
                        insumos={insumos}
                        filtrar={filtrar}
                    />
                </div>
            }
            {
                (sidebarKey === "CREAR INSUMO") &&
                <div className="container__botones">
                    <h4> Insumos </h4>
                    <a href="/insumos" className="sidebar__a">
                        <FontAwesomeIcon className="sidebar__icon" icon={faList} /> 
                        <div>Lista</div>
                    </a>
                </div>
            }
            {
                (sidebarKey === "UPDATE INSUMO") &&
                <div className="container__botones">
                    <h4> Insumos </h4>
                    <a href="/insumos" className="sidebar__a"> 
                        <FontAwesomeIcon className="sidebar__icon" icon={faList} /> 
                        <div>Lista</div>
                    </a>
                    <a href="/crear-insumo" className="sidebar__a">
                        <FontAwesomeIcon className="sidebar__icon" icon={faPlus} /> 
                        <div>Cargar</div>
                    </a>
                </div>
            }
            {
                (sidebarKey === "ADMIN MENU") &&
                <div className="container__botones">
                    <h4> Panel General </h4>
                    {
                        (sidebarSubKey === "LISTA-USUARIOS") &&
                        <a href="/admin/lista-usuarios" className="sidebar__a activo"> 
                            <FontAwesomeIcon className="sidebar__icon" icon={faList}/> 
                            <div>Lista Usuarios</div>
                        </a>
                    }
                    {
                        (sidebarSubKey !== "LISTA-USUARIOS") &&
                        <a href="/admin/lista-usuarios" className="sidebar__a"> 
                            <FontAwesomeIcon className="sidebar__icon" icon={faList}/> 
                            <div>Lista Usuarios</div>
                        </a>
                    }
                    {
                        (sidebarSubKey === "HABILITAR-USUARIO") &&
                        <a href="/admin/habilitar-usuario" className="sidebar__a activo"> 
                            <FontAwesomeIcon className="sidebar__icon" icon={faCheck}/>
                            <div>Habilitar Usuario</div> 
                        </a>
                    }
                    {
                        (sidebarSubKey !== "HABILITAR-USUARIO") &&
                        <a href="/admin/habilitar-usuario" className="sidebar__a"> 
                            <FontAwesomeIcon className="sidebar__icon" icon={faCheck}/>
                            <div>Habilitar Usuario</div> 
                        </a>
                    }
                    {
                        (sidebarSubKey === "BORRAR-USUARIO") &&
                        <a href="/admin/borrar-usuario" className="sidebar__a activo">
                            <FontAwesomeIcon className="sidebar__icon" icon={faTrashCan}/> 
                            <div>Borrar Usuario</div>
                        </a>
                    }
                    {
                        (sidebarSubKey !== "BORRAR-USUARIO") &&
                        <a href="/admin/borrar-usuario" className="sidebar__a">
                            <FontAwesomeIcon className="sidebar__icon" icon={faTrashCan}/> 
                            <div>Borrar Usuario</div>
                        </a>
                    }
                    {
                        (sidebarSubKey === "UPDATE-ADMIN") &&
                        <a href="/admin/update-password" className="sidebar__a activo"> 
                            <FontAwesomeIcon className="sidebar__icon" icon={faGear} />
                            <div>Mod. Contraseña </div>
                        </a>
                    }
                    {
                        (sidebarSubKey !== "UPDATE-ADMIN") &&
                        <a href="/admin/update-password" className="sidebar__a"> 
                            <FontAwesomeIcon className="sidebar__icon" icon={faGear} />
                            <div>Mod. Contraseña </div>
                        </a>
                    }
                </div>
            }
            {
                (sidebarKey === "RENTABILIDAD") &&
                <div className="container__botones">
                    <h4> Rentabilidad </h4>
                    <a href="/productos" className="sidebar__a">
                        <FontAwesomeIcon className="sidebar__icon" icon={faList} /> 
                        <div>Productos</div>
                    </a>
                </div>
            }
        </aside>
    );
}

export default Sidebar;