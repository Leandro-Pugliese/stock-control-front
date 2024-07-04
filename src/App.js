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

function App() {
  return (
    <BrowserRouter>
      <NavbarProvider>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Inicio/>}/>
          <Route path='/crear-usuario' element={<CrearUsuario/>}/>
          <Route path='/login-usuario' element={<LoginUsuario/>}/>
        </Routes>
      </NavbarProvider>
    </BrowserRouter>
  );
}

export default App;
