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
// Admin
import CrearAdmin from './Usuario/crearAdmin';
import LoginAdmin from "./Usuario/loginAdmin";
// Productos
import ListaProductos from './Productos/listaProductos';
// Footer
import Footer from './Footer/footer';

function App() {
  return (
    <BrowserRouter>
      <NavbarProvider>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Inicio/>}/>
          <Route path='/crear-admin' element={<CrearAdmin/>}/>
          <Route path='/login-admin' element={<LoginAdmin/>}/>
          <Route path='/crear-usuario' element={<CrearUsuario/>}/>
          <Route path='/login-usuario' element={<LoginUsuario/>}/>
          <Route path='/productos' element={<ListaProductos/>}/>
        </Routes>
        <Footer/>
      </NavbarProvider>
    </BrowserRouter>
  );
}

export default App;
