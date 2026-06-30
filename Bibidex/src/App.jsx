import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import Administration from "./pages/Administration";
import AdministrationObjects from "./pages/AdministrationObjects";
import AdministrationUsers from "./pages/AdministrationUsers";
import ScrollToHash from "./components/ScrollToHash";
import {
    asegurarUsuarioAdministrador,
    usuarioTieneRolAdministrador
} from "./utils/adminUser";

import "./styles/index.css";

function renderRutaAdministracion(elemento) {
    if (!usuarioTieneRolAdministrador()) {
        return <Navigate to = "/login" replace/>;
    }

    return elemento;
}

export default function App() {
    useEffect(() => {
        asegurarUsuarioAdministrador();
    }, []);

    return (
        <BrowserRouter>
            <ScrollToHash/>
            
            <Header/>

            <Routes>
                <Route path = "/" element = {<Home/>}/>
                <Route path = "/login" element = {<Login/>}/>
                <Route path = "/register" element = {<Register/>}/>
                <Route path = "/contactar" element = {<Contact/>}/>
                <Route
                    path = "/administracion"
                    element = {renderRutaAdministracion(<Administration/>)}
                />
                <Route
                    path = "/administracion/usuarios"
                    element = {renderRutaAdministracion(<AdministrationUsers/>)}
                />
                <Route
                    path = "/administracion/objetos"
                    element = {renderRutaAdministracion(<AdministrationObjects/>)}
                />
            </Routes>

            <Footer/>

        </BrowserRouter>
    );
}
