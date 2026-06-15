import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import Administration from "./pages/Administration";
import AdministrationUsers from "./pages/AdministrationUsers";
import ScrollToHash from "./components/ScrollToHash";

import "./styles/Carrusel.css";
import "./styles/Contacto.css";
import "./styles/LandingPage.css";
import "./styles/LoginRegistro.css";

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToHash/>
            
            <Header/>

            <Routes>
                <Route path = "/" element = {<Home/>}/>
                <Route path = "/login" element = {<Login/>}/>
                <Route path = "/register" element = {<Register/>}/>
                <Route path = "/contactar" element = {<Contact/>}/>
                <Route path = "/administracion" element = {<Administration/>}/>
                <Route path = "/administracion/usuarios" element = {<AdministrationUsers/>}/>
            </Routes>

            <Footer/>

        </BrowserRouter>
    );
}
