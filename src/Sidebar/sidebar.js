import "../App.css";
import "./sidebar.css";

function Sidebar( {renderProductosLista, renderProductosCarga} ) {

    return (
        <aside className="sidebar">
            <h4> Productos </h4>
            <button onClick={renderProductosLista}> Lista productos </button>
            <button onClick={renderProductosCarga}> Cargar producto </button>
        </aside>
    );
}

export default Sidebar;