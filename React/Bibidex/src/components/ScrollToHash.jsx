import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const elemento = document.querySelector(location.hash);

            if (elemento) {
                elemento.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [location]);

    return null;
}