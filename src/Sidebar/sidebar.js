import "../App.css";
import "./sidebar.css";
import Filtros from "../Componentes/filtros";

function Sidebar({  renderProductosLista, renderProductosCarga, sidebarKey, 
                    indicador, filtrar, productos, insumos, 
                    handleChangeSku, handleChangeStockMin, handleChangeStockMax,
                    handleChangeInsumo, handleChangeCategoria, categoriasProductos
                }){

    return (
        <aside className="sidebar">
            {
                (sidebarKey === "LISTA PRODUCTOS") &&
                <div className="container__botones">
                    <h4> Productos </h4>
                    <button onClick={renderProductosLista}> Lista </button>
                    <button onClick={renderProductosCarga}> Cargar </button>
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
                    <a href="/productos"> Lista </a>
                </div>
            }
            {
                (sidebarKey === "LISTA INSUMOS") &&
                <div className="container__botones">
                    <h4> Insumos </h4>
                    <a href="/crear-insumo"> Cargar </a>
                </div>
            }
            {
                (sidebarKey === "CREAR INSUMO") &&
                <div className="container__botones">
                    <h4> Insumos </h4>
                    <a href="/insumos"> Lista </a>
                </div>
            }
            {
                (sidebarKey === "UPDATE INSUMO") &&
                <div className="container__botones">
                    <h4> Insumos </h4>
                    <a href="/insumos"> Lista </a>
                    <a href="/crear-insumo"> Cargar </a>
                </div>
            }
            {
                (sidebarKey === "ADMIN MENU") &&
                <div className="container__botones">
                    <h4> Panel General </h4>
                    <a href="/admin/lista-usuarios"> Lista Usuarios </a>
                    <a href="/admin/habilitar-usuario"> Habilitar Usuario </a>
                    <a href="/admin/borrar-usuario"> Borrar Usuario </a>
                    <a href="/admin/update-password"> Cambiar Contraseña </a>
                </div>
            }
            {
                (sidebarKey === "RENTABILIDAD") &&
                <div className="container__botones">
                    <h4> Rentabilidad </h4>
                    <a href="/productos"> Lista Productos </a>
                </div>
            }
        </aside>
    );
}

export default Sidebar;