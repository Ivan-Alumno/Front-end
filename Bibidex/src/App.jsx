import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

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

function renderRutaAdministracion(elemento, esAdministrador) {
    if (!esAdministrador) {
        return <Navigate to = "/login" replace/>;
    }

    return elemento;
}

export default function App() {
    const [esAdministrador, setEsAdministrador] = useState(usuarioTieneRolAdministrador());

    useEffect(() => {
        asegurarUsuarioAdministrador();

        function manejarUsuarioActualizado() {
            setEsAdministrador(usuarioTieneRolAdministrador());
        }

        globalThis.addEventListener("usuarioActualizado", manejarUsuarioActualizado);

        return () => {
            globalThis.removeEventListener("usuarioActualizado", manejarUsuarioActualizado);
        };
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
                    element = {renderRutaAdministracion(<Administration/>, esAdministrador)}
                />
                <Route
                    path = "/administracion/usuarios"
                    element = {renderRutaAdministracion(<AdministrationUsers/>, esAdministrador)}
                />
                <Route
                    path = "/administracion/objetos"
                    element = {renderRutaAdministracion(<AdministrationObjects/>, esAdministrador)}
                />
            </Routes>

            <Footer/>

        </BrowserRouter>
    );
}
