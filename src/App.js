import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
//Navbar
import { NavbarProvider } from './Navbar/navbarProvider';
import Navbar from './Navbar/navbar';
// Inicio
import Inicio from "./Inicio/inicio";
// Usuario
import CrearUsuario from "./Usuario/crearUsuario";
import LoginUsuario from './Usuario/loginUsuario';
import UpdatePasswordUsuario from './Usuario/updateUsuario';
// Admin
import CrearAdmin from './Usuario/crearAdmin';
import LoginAdmin from "./Usuario/loginAdmin";
import ListaUsuarios from './Usuario/listaUsuarios';
import HabilitarUsuario from './Usuario/habilitarUsuario';
import BorrarUsuario from './Usuario/borrarUsuario';
import UpdatePasswordAdmin from './Usuario/updateAdmin';
// Productos
import ListaProductos from './Productos/listaProductos';
import UpdateStock from "./Productos/updateStockProducto";
import UpdateComponentes from './Productos/updateComponentes';
import UpdateCategoria from './Productos/updateCategoria';
// Insumos
import CrearInsumo from './Insumos/crearInsumo';
import ListaInsumos from './Insumos/listaInsumos';
import UpdateInsumo from './Insumos/updateInsumo';
// Footer
import Footer from './Footer/footer';

function App() {
  return (
    <BrowserRouter>
      <NavbarProvider>
        <Navbar/>
        <Routes>
          {/* Inicio */}
          <Route path='/' element={<Inicio/>}/>
          {/* Admin */}
          <Route path='/crear-admin' element={<CrearAdmin/>}/>
          <Route path='/login-admin' element={<LoginAdmin/>}/>
          <Route path='/admin/update-password' element={<UpdatePasswordAdmin/>}/>
          <Route path='/admin/lista-usuarios' element={<ListaUsuarios/>}/>
          <Route path='/admin/habilitar-usuario' element={<HabilitarUsuario/>}/>
          <Route path='/admin/borrar-usuario' element={<BorrarUsuario/>}/>
          {/* Usuario */}
          <Route path='/crear-usuario' element={<CrearUsuario/>}/>
          <Route path='/login-usuario' element={<LoginUsuario/>}/>
          <Route path='/usuario/update-password' element={<UpdatePasswordUsuario/>}/>
          {/* Productos */}
          <Route path='/productos' element={<ListaProductos/>}/>
          <Route path='/productos/update-stock' element={<UpdateStock/>}/>
          <Route path='/productos/update-componentes' element={<UpdateComponentes/>}/>
          <Route path='/productos/update-categoria' element={<UpdateCategoria/>}/>
          {/* Insumos */}
          <Route path='/crear-insumo' element={<CrearInsumo/>}/>
          <Route path='/insumos' element={<ListaInsumos/>}/>
          <Route path='/update-insumo' element={<UpdateInsumo/>}/>
        </Routes>
        <Footer/>
      </NavbarProvider>
    </BrowserRouter>
  );
}

export default App;
