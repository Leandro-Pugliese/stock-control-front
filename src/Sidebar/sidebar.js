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
        </aside>
    );
}

export default Sidebar;