import Hero from "../components/Hero";
import Carousel from "../components/Carousel";
import Tools from "../components/Tools";
import Benefits from "../components/Benefits";

export default function Home() {

    return (
        <div>
            <main>
                <Hero/>
                <Carousel/>
                <Tools/>
                <Benefits/>
            </main>
        </div>
    );
}