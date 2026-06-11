import { useEffect, useState } from "react";

import diapositiva1 from "../assets/Diapositiva_1.png";
import diapositiva2 from "../assets/Diapositiva_2.png";
import diapositiva3 from "../assets/Diapositiva_3.png";

export default function Carousel() {
  
    const slides = [
      {
        imagen: diapositiva1,
        alt: "Diapositiva 1",
        titulo: "Mejoras de Equipamiento"
      },
      {
        imagen: diapositiva2,
        alt: "Diapositiva 2",
        titulo: "Editor de Estadísticas"
      },
      {
        imagen: diapositiva3,
        alt: "Diapositiva 3",
        titulo: "Tabla de Experiencia"
      }
    ];

    const [slideActual, setSlideActual] = useState(0);

    function siguienteSlide() {setSlideActual((slideActual + 1) % slides.length);}

    function anteriorSlide() {setSlideActual((slideActual - 1 + slides.length) % slides.length);}

    useEffect(() => {
      const intervalo = setInterval(() => {setSlideActual((actual) => (actual + 1) % slides.length);}, 5000);

      return () => clearInterval(intervalo);
    }, [slides.length]);

    return (
      <section id = "carrusel">
        <h2>Ejemplos</h2>

        <div className = "carrusel-envoltura">

            {/*Botón anterior*/}
            <button className = "carrusel-btn prev" onClick = {anteriorSlide} type = "button"> &#10094; </button>

            {/*Contenedor de diapositivas*/}
            <div className = "carrusel-container">
              
              <div className = "carrusel-slides" style = {{transform: `translateX(-${slideActual * 100}%)`}}>
                {slides.map((slide, index) => (
                  <div className = "slide" key = {slide.titulo}>
                    <img src = {slide.imagen} alt = {slide.alt}/>
                    
                    <div className = "slide-texto">
                      <h3>{slide.titulo}</h3>
                    </div>

                  </div>
                ))}
              </div>

            </div>

            {/*Botón siguiente*/}
            <button className = "carrusel-btn next" onClick = {siguienteSlide} type = "button"> &#10095; </button>
        </div>

        {/*Indicadores de diapositiva*/}
        <div className = "indicadores">
          {slides.map((slide, index) => (
            <button key = {slide.alt} className = {index === slideActual ? "indicador active" : "indicador"} 
              onClick = {() => setSlideActual(index)} aria-label={`Ir a ${slide.alt}`} type = "button"></button>
          ))}
        </div>
      </section>
    );
}