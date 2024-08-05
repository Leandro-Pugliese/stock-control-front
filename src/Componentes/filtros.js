import "../App.css";
import "./componentes.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

function Filtros({  indicador, productos, insumos, filtrar,
                    handleChangeSku, handleChangeStockMin, handleChangeStockMax,
                    handleChangeInsumo, handleChangeCategoria, categoriasProductos,
                    handleChangeInsumoNombre, handleChangePrecioMin, handleChangePrecioMax
                }) {
    
    return (
        <div>
        {
            (indicador !== "CARGA") &&
            <div className="filtros__general">
                <div className="icono__filtro"><FontAwesomeIcon icon={faFilter}/></div>
                {
                    (indicador === "PRODUCTOS") &&
                    <div>
                        <div className="filtro__container">
                            <label>
                                Sku
                            </label>
                            <select onChange={handleChangeSku} className="">
                                <option value="">Todos</option>
                                {
                                    productos.map((elemento, indice) => (
                                        <option key={indice} value={elemento.sku}>
                                            {elemento.sku}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="filtro__container">
                            <label>
                                Stock Mínimo
                            </label>
                            <input type="number" name="stockMin" onChange={handleChangeStockMin} defaultValue={1}/>
                        </div>
                        <div className="filtro__container">
                            <label>
                                Stock Máximo
                            </label>
                            <input type="number" name="stockMax" onChange={handleChangeStockMax} defaultValue={1000}/>
                        </div>
                        <div className="filtro__container">
                            <label>
                                Insumo
                            </label>
                            <select onChange={handleChangeInsumo} className="">
                                <option value="">-</option>
                                {
                                    insumos.map((elemento, indice) => (
                                        <option key={indice} value={elemento.nombre}>
                                            {elemento.nombre}
                                        </option>
                                            
                                    ))
                                }
                            </select>
                        </div>
                        <div className="filtro__container">
                            <label>
                                Categoría
                            </label>
                            <select onChange={handleChangeCategoria} className="">
                                <option value="">Todas</option>
                                {
                                    categoriasProductos.map((elemento, indice) => (
                                        <option key={indice} value={elemento.categoria}>
                                            {elemento.categoria}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                }
                {
                    (indicador === "INSUMOS") &&
                    <div>
                        <div className="filtro__container">
                            <label>Nombre</label>
                            <select  className="" onChange={handleChangeInsumoNombre}>
                                <option value="">Todos</option>
                            {
                                insumos.map((elemento, indice) => (
                                    <option key={indice} value={elemento.nombre}>
                                        {elemento.nombre}
                                    </option>
                                ))
                            }
                            </select>
                        </div>
                        <div className="filtro__container">
                            <label>
                                Precio Mínimo
                            </label>
                            <input type="number" name="precioMin" onChange={handleChangePrecioMin} defaultValue={1}/>
                        </div>
                        <div className="filtro__container">
                            <label>
                                Precio Máximo
                            </label>
                            <input type="number" name="precioMax" onChange={handleChangePrecioMax} defaultValue={1000000}/>
                        </div>
                    </div>
                }
                <div className="container__boton-filtro">
                    <button className="boton__filtro" onClick={() => {filtrar()}}> Filtrar </button>
                </div>
            </div>
        }
        </div>
    );
}

export default Filtros;