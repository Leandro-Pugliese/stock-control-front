import "../App.css";
import "./componentes.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

function Filtros({  indicador, productos, insumos, filtrar,
                    handleChangeSku, handleChangeStockMin, handleChangeStockMax,
                    handleChangeInsumo, handleChangeCategoria, categoriasProductos
                }) {
    //Filtros productos (SKU, STOCKMIN, STOCKMAX, CATEGORIA, COMPONENTE(INSUMO)).
    //Filtros insumos (nombre, precio=x, precioMin, precioMax).
    
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
                                <option value="">-</option>
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
                                <option value="">-</option>
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
                        <div className="">
                            <label>Nombre</label>
                            <select  className="">
                            {
                                insumos.map((elemento, indice) => (
                                    <option key={indice} value={elemento}>
                                        {elemento.nombre}
                                    </option>
                                ))
                            }
                            </select>
                        </div>
                        <div className="">
                            <label>Precio exacto</label>
                            <select  className="">
                            {
                                insumos.map((elemento, indice) => (
                                    <option key={indice} value={elemento}>
                                        {elemento.precio}
                                    </option>
                                ))
                            }
                            </select>
                        </div>
                        <div className="">
                            <label>
                                Precio Mínimo
                                <input type="number" name="precioMin"  />
                            </label>
                        </div>
                        <div className="">
                            <label>
                                Precio Máximo
                                <input type="number" name="precioMax"/>
                            </label>
                        </div>
                    </div>
                }
                <div className="boton__filtro">
                    <button className="" onClick={() => {filtrar()}}> Filtrar </button>
                </div>
            </div>
        }
        </div>
    );
}

export default Filtros;