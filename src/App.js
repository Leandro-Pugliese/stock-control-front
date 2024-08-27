import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
//Navbar
import { NavbarProvider } from './Navbar/navbarProvider';
import Navbar from './Navbar/navbar';
// Inicio
import Inicio from "./Inicio/inicio";
// Usuario
import CrearUsuario from "./Usuario/crearUsuario";
import LoginUsuario from './Usuario/loginUsuario';
import UpdatePasswordUsuario from './Usuario/updateUsuario';
import RecuperarPass from './Usuario/recuperarPass';
import GenerarPass from './Usuario/generarPass';
// Admin
import CrearAdmin from './Usuario/crearAdmin';
import LoginAdmin from "./Usuario/loginAdmin";
import ListaUsuarios from './Usuario/listaUsuarios';
import HabilitarUsuario from './Usuario/habilitarUsuario';
import BorrarUsuario from './Usuario/borrarUsuario';
import UpdatePasswordAdmin from './Usuario/updateAdmin';
import RecuperarPassword from "./Usuario/recuperarPassword";
import GenerarPassword from './Usuario/generarPassword';
// Productos
import ListaProductos from './Productos/listaProductos';
import UpdateStock from "./Productos/updateStockProducto";
import UpdateComponentes from './Productos/updateComponentes';
import UpdateCategoria from './Productos/updateCategoria';
import Rentabilidad from './Productos/rentabilidad';
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
          <Route path='/recuperar-password' element={<RecuperarPassword/>}/> 
          <Route path='/recuperar-password/:id/:token' element={<GenerarPassword/>}/>
          {/* Usuario */}
          <Route path='/crear-usuario' element={<CrearUsuario/>}/>
          <Route path='/login-usuario' element={<LoginUsuario/>}/>
          <Route path='/usuario/update-password' element={<UpdatePasswordUsuario/>}/>
          <Route path='/recuperar-pass' element={<RecuperarPass/>}/> 
          <Route path='/recuperar-pass/:id/:token' element={<GenerarPass/>}/>
          {/* Productos */}
          <Route path='/productos' element={<ListaProductos/>}/>
          <Route path='/productos/update-stock' element={<UpdateStock/>}/>
          <Route path='/productos/update-componentes' element={<UpdateComponentes/>}/>
          <Route path='/productos/update-categoria' element={<UpdateCategoria/>}/>
          <Route path='/rentabilidad' element={<Rentabilidad/>}/>
          {/* Insumos */}
          <Route path='/crear-insumo' element={<CrearInsumo/>}/>
          <Route path='/insumos' element={<ListaInsumos/>}/>
          <Route path='/update-insumo' element={<UpdateInsumo/>}/>
          {/* REDIRECCIONAMIENTO PARA RUTAS NO DEFINIDAS */}
          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
        <Footer/>
      </NavbarProvider>
    </BrowserRouter>
  );
}

export default App;
