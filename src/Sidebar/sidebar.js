import "../App.css";
import "./sidebar.css";

function Sidebar( {renderProductosLista, renderProductosCarga, sidebarKey} ) {

    return (
        <aside className="sidebar">
            {
                (sidebarKey === "LISTA PRODUCTOS") &&
                <div className="container__botones">
                    <h4> Productos </h4>
                    <button onClick={renderProductosLista}> Lista </button>
                    <button onClick={renderProductosCarga}> Cargar </button>
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
                    <a href="/"> Mi Cuenta </a>
                </div>
            }
        </aside>
    );
}

export default Sidebar;